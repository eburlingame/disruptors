import { first, range, shuffle, sum } from "lodash";
import {
  computeLongestRoad,
  distributeResources,
  edgeCoordinateEqual,
  findTile,
  getCommonEdgeCoordinate,
  getCommonVertexCoordinate,
  playerHasBuildingNextToRobber,
  tilesTouchingVertex,
  tileTypeToResourceType,
  vectorsEqual,
  vertexCoordinateEqual,
} from "./board_utils";
import {
  BuildingType,
  BuildSettlementAction,
  CatanAction,
  CatanPlayer,
  CatanState,
  DevelopmentCardType,
  EdgeCoordinate,
  GamePhase,
  GameTile,
  PlayerTurnState,
  ResourceCount,
  ResourceType,
  TileCoordinate,
  TileType,
  TradeAcceptance,
  TradeRequest,
  VertexCoordinate,
} from "./types";
import { sumResources } from "./utils";

export type ActionHandler = (
  state: CatanState,
  playerId: string,
  action: CatanAction
) => CatanState;

const isVertexEmpty = (state: CatanState, location: VertexCoordinate) => {
  location = getCommonVertexCoordinate(state.board.tiles, location);

  return (
    state.buildings.find((building) =>
      vertexCoordinateEqual(location, building.location)
    ) === undefined
  );
};

const isEdgeEmpty = (state: CatanState, location: EdgeCoordinate) => {
  location = getCommonEdgeCoordinate(state.board.tiles, location);

  return (
    state.roads.find((road) => edgeCoordinateEqual(location, road.location)) ===
    undefined
  );
};

const getPlayer = (state: CatanState, playerId: string) => {
  const player = state.players.find((player) => player.playerId === playerId);
  if (player) {
    return player;
  }

  throw new Error("Unable to find player with playerId " + playerId);
};

const getPlayerIndex = (state: CatanState, playerId: string) => {
  const playerIndex = state.players.findIndex(
    (player) => player.playerId === playerId
  );

  return playerIndex;
};

const previousPlayer = (state: CatanState) => {
  const currentPlayerIndex = state.players.findIndex(
    (player) => player.playerId === state.activePlayerId
  );

  let newIndex = currentPlayerIndex - 1;
  if (newIndex < 0) {
    newIndex = state.players.length - 1;
  }

  return state.players[newIndex].playerId;
};

const nextPlayer = (state: CatanState) => {
  const currentPlayerIndex = state.players.findIndex(
    (player) => player.playerId === state.activePlayerId
  );

  let newIndex = currentPlayerIndex + 1;
  if (newIndex >= state.players.length) {
    newIndex = 0;
  }

  return state.players[newIndex].playerId;
};

const isFirstPlayer = (state: CatanState, playerId: string) => {
  return state.players[0].playerId === playerId;
};

const isLastPlayer = (state: CatanState, playerId: string) => {
  return state.players[state.players.length - 1].playerId === playerId;
};

const canBuildRoad = (player: CatanPlayer): boolean =>
  player.resources.brick >= 1 && player.resources.wood >= 1;

const canBuildSettlement = (player: CatanPlayer): boolean =>
  player.resources.brick >= 1 &&
  player.resources.wood >= 1 &&
  player.resources.sheep >= 1 &&
  player.resources.wheat >= 1;

const canBuildCity = (player: CatanPlayer): boolean =>
  player.resources.ore >= 3 && player.resources.wheat >= 2;

const canBuyDevelopmentCard = (player: CatanPlayer): boolean =>
  player.resources.ore >= 1 &&
  player.resources.sheep >= 1 &&
  player.resources.wheat >= 1;

const resourceFromBankToPlayer = (
  state: CatanState,
  playerId: string,
  resourceType: ResourceType,
  quantity: number
): CatanState => {
  if (state.bank[resourceType] >= quantity) {
    const newTotal = state.bank[resourceType] - quantity;

    return {
      ...state,
      bank: {
        ...state.bank,
        [resourceType]: newTotal,
      },
      players: state.players.map((player) => {
        if (playerId === player.playerId) {
          const newQuantity = player.resources[resourceType] + quantity;

          return {
            ...player,
            resources: {
              ...player.resources,
              [resourceType]: newQuantity,
            },
          };
        }

        return player;
      }),
    };
  }

  throw new Error("Not enough resources");
};

const tradePlayerResource = (
  state: CatanState,
  seekerPlayerId: string,
  giverPlayerId: string,
  resourceType: ResourceType,
  quantity: number
): CatanState => {
  const giverIndex = state.players.findIndex(
    ({ playerId }) => playerId === giverPlayerId
  );

  if (state.players[giverIndex].resources[resourceType] < quantity) {
    throw new Error("Not enough resources to be given");
  }

  return {
    ...state,
    players: state.players.map((player) => {
      if (giverPlayerId === player.playerId) {
        return {
          ...player,
          resources: {
            ...player.resources,
            [resourceType]: player.resources[resourceType] - quantity,
          },
        };
      }

      if (seekerPlayerId === player.playerId) {
        return {
          ...player,
          resources: {
            ...player.resources,
            [resourceType]: player.resources[resourceType] + quantity,
          },
        };
      }

      return player;
    }),
  };
};

const performPlayerTrade = (
  state: CatanState,
  seekerPlayerId: string,
  giverPlayerId: string,
  seeking: ResourceCount[],
  giving: ResourceCount[]
): CatanState => {
  /// Move the "seeking" cards from the seeker to the giver
  seeking.forEach(({ resource, count }) => {
    state = tradePlayerResource(
      state,
      seekerPlayerId,
      giverPlayerId,
      resource,
      count
    );
  });

  /// Move the "giving" cards from the giver to the seeker
  giving.forEach(({ resource, count }) => {
    state = tradePlayerResource(
      state,
      giverPlayerId,
      seekerPlayerId,
      resource,
      count
    );
  });

  return state;
};

const performBankTrade = (
  state: CatanState,
  playerId: string,
  seeking: ResourceCount[],
  giving: ResourceCount[]
): CatanState => {
  /// Move the "seeking" cards from the seeker to the giver
  seeking.forEach(({ resource, count }) => {
    state = resourceFromBankToPlayer(state, playerId, resource, count);
  });

  /// Move the "giving" cards from the giver to the seeker
  giving.forEach(({ resource, count }) => {
    state = resourceFromBankToPlayer(state, playerId, resource, -count);
  });

  return state;
};

const collectResourceFromTile = (
  state: CatanState,
  playerId: string,
  gameTile: GameTile,
  quantity: number
): CatanState => {
  const { tileType } = gameTile;

  const resourceType = tileTypeToResourceType(tileType);
  if (resourceType) {
    return resourceFromBankToPlayer(state, playerId, resourceType, quantity);
  }

  return state;
};

const playersVictoryPoints = (state: CatanState, playerId: string) => {
  const player = getPlayer(state, playerId);

  const longestRoad = Math.max(
    ...state.players.map(({ longestRoad }) => longestRoad)
  );

  const longestRoadPoints =
    player.longestRoad === longestRoad && longestRoad >= 5 ? 2 : 0;

  const mostRobberDeploys = Math.max(
    ...state.players.map(({ robberDeployCount }) => robberDeployCount)
  );

  const largestArmyPoints =
    player.robberDeployCount === mostRobberDeploys && mostRobberDeploys >= 3
      ? 2
      : 0;

  const cityCount = state.buildings.filter(
    (building) =>
      building.type === BuildingType.City && building.playerId === playerId
  ).length;

  const settlementCount = state.buildings.filter(
    (building) =>
      building.type === BuildingType.Settlement &&
      building.playerId === playerId
  ).length;

  const publicPoints =
    2 * cityCount + settlementCount + longestRoadPoints + largestArmyPoints;

  const privatePoints = player.developmentCards.victoryPoint;

  return {
    public: publicPoints,
    private: privatePoints,
  };
};

const computeVictoryPoints = (state: CatanState): CatanState => {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      points: playersVictoryPoints(state, player.playerId),
    })),
  };
};

const pickRandomResource = (
  state: CatanState,
  playerId: string
): ResourceType | undefined => {
  const player = getPlayer(state, playerId);

  const resourceCards = shuffle(
    Object.entries(player.resources).flatMap(([resource, count]) =>
      range(count).map(() => resource as ResourceType)
    )
  );

  return first(resourceCards);
};

const buildSettlement = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "buildSettlement") {
    throw Error("Invalid action");
  }

  const player = getPlayer(state, playerId);

  const location = getCommonVertexCoordinate(
    state.board.tiles,
    action.location
  );

  if (state.phase === GamePhase.PLAYING) {
    if (!canBuildSettlement(player)) {
      throw new Error("Not enough resources to build settlement");
    }
  }

  /// TODO: Enforce distance rule
  if (isVertexEmpty(state, location)) {
    state.buildings = [
      ...state.buildings,
      {
        location: location,
        type: BuildingType.Settlement,
        playerId,
      },
    ];
  } else {
    throw new Error("There is already a building there");
  }

  if (state.phase === GamePhase.PLAYING) {
    /// Pay for the settlement
    state = resourceFromBankToPlayer(state, playerId, ResourceType.BRICK, -1);
    state = resourceFromBankToPlayer(state, playerId, ResourceType.WOOD, -1);
    state = resourceFromBankToPlayer(state, playerId, ResourceType.SHEEP, -1);
    state = resourceFromBankToPlayer(state, playerId, ResourceType.WHEAT, -1);

    state.activePlayerTurnState = PlayerTurnState.IDLE;
  } else if (state.phase === GamePhase.SETUP_ROUND_1) {
    /// During setup, after placing a settlement they have to place a road
    state.activePlayerTurnState = PlayerTurnState.PLACING_ROAD;
  } else if (state.phase === GamePhase.SETUP_ROUND_2) {
    state.activePlayerTurnState = PlayerTurnState.PLACING_ROAD;

    tilesTouchingVertex(state.board.tiles, location).forEach((tile) => {
      state = collectResourceFromTile(state, playerId, tile, 1);
    });
  }

  return state;
};

const buildCity = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "buildCity" || state.phase !== GamePhase.PLAYING) {
    throw Error("Invalid action");
  }

  const location = getCommonVertexCoordinate(
    state.board.tiles,
    action.location
  );

  const player = getPlayer(state, playerId);

  if (!canBuildCity(player)) {
    throw new Error("Not enough resources to build a city");
  }

  const existingSettlement = state.buildings.find(
    (building) =>
      building.playerId === playerId &&
      building.type === BuildingType.Settlement &&
      vertexCoordinateEqual(
        location,
        getCommonVertexCoordinate(state.board.tiles, action.location)
      )
  );

  if (existingSettlement) {
    state.buildings = [
      ...state.buildings,
      {
        location: location,
        type: BuildingType.City,
        playerId,
      },
    ];
  } else {
    throw new Error("You must have an existing settlement to build a city");
  }

  /// Pay for the city
  state = resourceFromBankToPlayer(state, playerId, ResourceType.ORE, -3);
  state = resourceFromBankToPlayer(state, playerId, ResourceType.WHEAT, -2);

  state.activePlayerTurnState = PlayerTurnState.IDLE;

  state = computeVictoryPoints(state);

  return state;
};

const buildRoad = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "buildRoad") {
    throw Error("Invalid action");
  }

  const player = getPlayer(state, playerId);
  const playerIndex = getPlayerIndex(state, playerId);

  const location = getCommonEdgeCoordinate(state.board.tiles, action.location);

  if (state.phase === GamePhase.PLAYING) {
    if (!canBuildRoad(player)) {
      throw new Error("Not enough resources to build a road");
    }
  }

  /// TODO: Enforce that you have to build a road where you have a settlement
  if (isEdgeEmpty(state, location)) {
    state.roads = [
      ...state.roads,
      {
        location: location,
        playerId,
      },
    ];
  } else {
    throw new Error("There is already a road there");
  }

  if (state.phase === GamePhase.PLAYING) {
    /// Pay for the road
    state = resourceFromBankToPlayer(state, playerId, ResourceType.BRICK, -1);
    state = resourceFromBankToPlayer(state, playerId, ResourceType.WOOD, -1);

    state.activePlayerTurnState = PlayerTurnState.IDLE;
  } else if (state.phase === GamePhase.SETUP_ROUND_1) {
    state.activePlayerTurnState = PlayerTurnState.PLACING_SETTLEMENT;

    if (isLastPlayer(state, state.activePlayerId)) {
      state.phase = GamePhase.SETUP_ROUND_2;
    } else {
      state.activePlayerId = nextPlayer(state);
    }
  } else if (state.phase === GamePhase.SETUP_ROUND_2) {
    if (isFirstPlayer(state, state.activePlayerId)) {
      state.activePlayerId = state.players[0].playerId;
      state.activePlayerTurnState = PlayerTurnState.MUST_ROLL;
      state.phase = GamePhase.PLAYING;
    } else {
      state.activePlayerTurnState = PlayerTurnState.PLACING_SETTLEMENT;
      state.activePlayerId = previousPlayer(state);
    }
  }

  state.players[playerIndex].longestRoad = computeLongestRoad(state, playerId);

  state = computeVictoryPoints(state);

  return state;
};

const rollDice = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "rollDice") {
    throw Error("Invalid action");
  }

  const diceTotal = sum(action.values);

  /// Robber rolled
  if (diceTotal === 7) {
    state.phase = GamePhase.ROBBER_ROLLER;

    state.players = state.players.map((player) => {
      const resourceCount = sumResources(player);

      if (resourceCount > state.config.cardDiscardLimit) {
        return {
          ...player,
          mustDiscard: Math.floor(resourceCount / 2.0),
        };
      }

      return player;
    });

    if (state.players.every(({ mustDiscard }) => mustDiscard === 0)) {
      state.phase = GamePhase.PLAYING;
      state.activePlayerTurnState = PlayerTurnState.MUST_PLACE_ROBBER;
    }
  }
  /// Otherwise, distribute resources normally
  else {
    if (action.distribution) {
      Object.entries(action.distribution).forEach(([playerId, got]) => {
        Object.entries(got).forEach(([resource, count]) => {
          state = resourceFromBankToPlayer(
            state,
            playerId,
            resource as ResourceType,
            count
          );
        });
      });
    }

    state.activePlayerTurnState = PlayerTurnState.IDLE;
  }

  return state;
};

const changeTurnAction = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "changeTurnAction") {
    throw Error("Invalid action");
  }

  if (action.turnAction === "buildCity") {
    state.activePlayerTurnState = PlayerTurnState.PLACING_CITY;
  } else if (action.turnAction === "buildSettlement") {
    state.activePlayerTurnState = PlayerTurnState.PLACING_SETTLEMENT;
  } else if (action.turnAction === "buildRoad") {
    state.activePlayerTurnState = PlayerTurnState.PLACING_ROAD;
  } else if (action.turnAction === "playDevCard") {
    state.activePlayerTurnState = PlayerTurnState.PLAYING_DEV_CARD;
  } else if (action.turnAction === "startBankTradeRequest") {
    state.activePlayerTurnState = PlayerTurnState.CREATING_BANK_TRADE_REQUEST;
  } else if (action.turnAction === "startPlayerTradeRequest") {
    state.activePlayerTurnState = PlayerTurnState.CREATING_PLAYER_TRADE_REQUEST;
  } else if (action.turnAction === "idle") {
    state.activePlayerTurnState = PlayerTurnState.IDLE;
  } else {
    throw Error("Invalid turn action");
  }

  return state;
};

const drawDevelopmentCard = (state: CatanState) => {
  const { knight, victoryPoint } = state.bank.developmentCards;

  let bankCards = shuffle([
    ...range(knight).map(() => DevelopmentCardType.KNIGHT),
    ...range(victoryPoint).map(() => DevelopmentCardType.VICTORY_POINT),
  ]);

  const drawnCard = bankCards.pop();

  if (!drawnCard) throw new Error("No cards left!");

  state.bank.developmentCards = {
    knight: bankCards.filter((card) => card === DevelopmentCardType.KNIGHT)
      .length,

    victoryPoint: bankCards.filter(
      (card) => card === DevelopmentCardType.VICTORY_POINT
    ).length,
  };

  return {
    drawnCard,
    state,
  };
};

const buyDevCard = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "buyDevCard") {
    throw Error("Invalid action");
  }

  const player = getPlayer(state, playerId);
  const playerIndex = getPlayerIndex(state, playerId);

  if (!canBuyDevelopmentCard(player)) {
    throw new Error("Not enough resources to buy development card");
  }

  /// Pay for the development card
  state = resourceFromBankToPlayer(state, playerId, ResourceType.ORE, -1);
  state = resourceFromBankToPlayer(state, playerId, ResourceType.WHEAT, -1);
  state = resourceFromBankToPlayer(state, playerId, ResourceType.SHEEP, -1);

  const { drawnCard, state: newState } = drawDevelopmentCard(state);
  state = newState;

  state.players[playerIndex].developmentCards[drawnCard] += 1;

  return state;
};

const playDevCard = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "playDevCard") {
    throw new Error("Invalid action");
  }

  const player = getPlayer(state, playerId);
  const playerIndex = getPlayerIndex(state, playerId);

  const { card } = action;

  if (player.developmentCards[card] <= 0) {
    throw new Error("You don't have that card to play");
  }

  /// Performt the card action
  if (card === DevelopmentCardType.KNIGHT) {
    state.activePlayerTurnState = PlayerTurnState.MUST_PLACE_ROBBER;
  }

  state.players[playerIndex].developmentCards[card] -= 1;

  return state;
};

const discardCards = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (action.name !== "discardCards") {
    throw Error("Invalid action");
  }

  if (state.phase !== GamePhase.ROBBER_ROLLER) {
    throw new Error("No need to discard");
  }

  const playerIndex = getPlayerIndex(state, playerId);

  /// Discard the given resource
  action.discarding.forEach(({ resource, count }) => {
    state = resourceFromBankToPlayer(state, playerId, resource, -count);
    state.players[playerIndex].mustDiscard -= count;
  });

  if (state.players.every(({ mustDiscard }) => mustDiscard === 0)) {
    state.phase = GamePhase.PLAYING;
    state.activePlayerTurnState = PlayerTurnState.MUST_PLACE_ROBBER;
  }

  return state;
};

const placeRobber = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "placeRobber") {
    throw Error("Invalid action");
  }

  if (state.activePlayerTurnState !== PlayerTurnState.MUST_PLACE_ROBBER) {
    throw new Error("No need to place robber");
  }

  state.robber = action.location;
  state.activePlayerTurnState = PlayerTurnState.MUST_STEAL_CARD;

  const nobodyToStealFrom = state.players.every(
    (player) =>
      !playerHasBuildingNextToRobber(
        state.board.tiles,
        state.robber,
        state.buildings,
        player.playerId
      )
  );

  if (nobodyToStealFrom) {
    state.activePlayerTurnState = PlayerTurnState.IDLE;
  }

  return state;
};

const stealCard = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "stealCard") {
    throw Error("Invalid action");
  }

  if (state.activePlayerTurnState !== PlayerTurnState.MUST_STEAL_CARD) {
    throw new Error("No need to steal a card");
  }

  const canStealFrom = state.players
    .filter((player) => player.playerId !== playerId)
    .filter((player) =>
      playerHasBuildingNextToRobber(
        state.board.tiles,
        state.robber,
        state.buildings,
        player.playerId
      )
    )
    .map((player) => player.playerId);

  if (!canStealFrom.includes(action.stealFrom)) {
    throw new Error("Invalid player to steal from");
  }

  const resourceToSteal = pickRandomResource(state, action.stealFrom);

  if (resourceToSteal) {
    state = tradePlayerResource(
      state,
      playerId,
      action.stealFrom,
      resourceToSteal,
      1
    );
  } else {
    console.warn("Player has no cards to steal");
  }

  state.activePlayerTurnState = PlayerTurnState.IDLE;

  return state;
};

const requestTrade = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "requestTrade") {
    throw Error("Invalid action");
  }

  state.activeTradeRequest = {
    playerId,
    seeking: action.seeking,
    giving: action.giving,
    acceptance: state.players.map((player) => ({
      playerId: player.playerId,
      acceptance: TradeAcceptance.UNDECIDED,
    })),
  };

  state.activePlayerTurnState = PlayerTurnState.SUBMITTED_PLAYER_TRADE_REQUEST;

  return state;
};

const acceptTrade = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (action.name !== "acceptTrade") {
    throw Error("Invalid action");
  }

  if (
    !state.activeTradeRequest ||
    state.activePlayerTurnState !==
      PlayerTurnState.SUBMITTED_PLAYER_TRADE_REQUEST
  ) {
    throw Error("No trade in progress");
  }

  state.activeTradeRequest.acceptance = state.activeTradeRequest.acceptance.map(
    (acceptance) => {
      if (acceptance.playerId === playerId) {
        return {
          ...acceptance,
          acceptance: action.acceptance,
        };
      }

      return acceptance;
    }
  );

  return state;
};

const completeTrade = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "completeTrade") {
    throw Error("Invalid action");
  }

  if (
    !state.activeTradeRequest ||
    state.activePlayerTurnState !==
      PlayerTurnState.SUBMITTED_PLAYER_TRADE_REQUEST
  ) {
    throw Error("No trade in progress");
  }

  if (action.completeTrade) {
    const { acceptedTradeFrom } = action;

    if (
      state.players.find(({ playerId }) => playerId === acceptedTradeFrom) ===
      undefined
    ) {
      throw Error("Invalid player");
    }

    state = performPlayerTrade(
      state,
      playerId,
      acceptedTradeFrom,
      state.activeTradeRequest.seeking,
      state.activeTradeRequest.giving
    );
  }

  state.activeTradeRequest = undefined;
  state.activePlayerTurnState = PlayerTurnState.IDLE;

  return state;
};

const bankTrade = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "bankTrade") {
    throw Error("Invalid action");
  }

  if (
    state.activePlayerTurnState !== PlayerTurnState.CREATING_BANK_TRADE_REQUEST
  ) {
    throw Error("No trade in progress");
  }

  state = performBankTrade(state, playerId, action.seeking, action.giving);
  state.activePlayerTurnState = PlayerTurnState.IDLE;

  return state;
};

const endTurn = (
  state: CatanState,
  playerId: string,
  action: CatanAction
): CatanState => {
  if (state.activePlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  if (action.name !== "endTurn") {
    throw Error("Invalid action");
  }

  state.activePlayerTurnState = PlayerTurnState.MUST_ROLL;
  state.activePlayerId = nextPlayer(state);

  return state;
};

const actionMap: { [name: string]: ActionHandler } = {
  buildSettlement,
  buildCity,
  buildRoad,
  rollDice,
  changeTurnAction,
  buyDevCard,
  playDevCard,
  requestTrade,
  acceptTrade,
  completeTrade,
  bankTrade,
  discardCards,
  placeRobber,
  stealCard,
  endTurn,
};

export default actionMap;
