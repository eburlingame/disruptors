import { sum } from "lodash";
import {
  edgeCoordinateEqual,
  findTile,
  getCommonEdgeCoordinate,
  getCommonVertexCoordinate,
  tilesTouchingVertex,
  vectorsEqual,
  vertexCoordinateEqual,
} from "./board_utils";
import {
  BuildingType,
  BuildSettlementAction,
  CatanAction,
  CatanPlayer,
  CatanState,
  EdgeCoordinate,
  GamePhase,
  GameTile,
  PlayerTurnState,
  ResourceType,
  TileCoordinate,
  VertexCoordinate,
} from "./types";

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

const collectResourceFromTile = (
  state: CatanState,
  playerId: string,
  gameTile: GameTile,
  quantity: number
): CatanState => {
  const { tileType } = gameTile;

  if (Object.values(ResourceType).includes(tileType as any)) {
    const resourceType = tileType as unknown as ResourceType;
    return resourceFromBankToPlayer(state, playerId, resourceType, quantity);
  }

  return state;
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

  const location = getCommonEdgeCoordinate(state.board.tiles, action.location);
  const player = getPlayer(state, playerId);

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

  const { tiles } = state.board;
  const diceTotal = sum(action.values);

  state.buildings.map(({ type, location, playerId: tilesPlayerId }) => {
    tilesTouchingVertex(tiles, location)
      .filter(({ diceNumber }) => diceNumber === diceTotal)
      .forEach((gameTile) => {
        if (type === BuildingType.Settlement) {
          state = collectResourceFromTile(state, tilesPlayerId, gameTile, 1);
        } else if (type === BuildingType.City) {
          state = collectResourceFromTile(state, tilesPlayerId, gameTile, 2);
        }
      });
  });

  state.activePlayerTurnState = PlayerTurnState.IDLE;

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
  } else if (action.turnAction === "idle") {
    state.activePlayerTurnState = PlayerTurnState.IDLE;
  } else {
    throw Error("Invalid turn action");
  }

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
  endTurn,
};

export default actionMap;
