import {
  edgeCoordinateEqual,
  getCommonEdgeCoordinate,
  getCommonVertexCoordinate,
  vertexCoordinateEqual,
} from "./board_utils";
import {
  BuildingType,
  BuildSettlementAction,
  CatanAction,
  CatanState,
  EdgeCoordinate,
  GamePhase,
  PlayerTurnState,
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

const isLastPlayer = (state: CatanState, playerId: string) => {
  return state.players[state.players.length - 1].playerId === playerId;
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

  const location = getCommonVertexCoordinate(
    state.board.tiles,
    action.location
  );

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

  if (
    state.phase === GamePhase.SETUP_ROUND_1 ||
    state.phase === GamePhase.SETUP_ROUND_2
  ) {
    /// During setup, after placing a settlement, they have to place a road
    state.activePlayerTurnState = PlayerTurnState.PLACING_ROAD;
  }

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

  if (state.phase === GamePhase.SETUP_ROUND_1) {
    state.activePlayerTurnState = PlayerTurnState.PLACING_SETTLEMENT;

    if (isLastPlayer(state, state.activePlayerId)) {
      state.activePlayerId = state.players[0].playerId;
      state.phase = GamePhase.SETUP_ROUND_2;
    } else {
      state.activePlayerId = nextPlayer(state);
    }
  } else if (state.phase === GamePhase.SETUP_ROUND_2) {
    if (isLastPlayer(state, state.activePlayerId)) {
      state.activePlayerId = state.players[0].playerId;
      state.activePlayerTurnState = PlayerTurnState.IDLE;
      state.phase = GamePhase.PLAYING;
    } else {
      state.activePlayerTurnState = PlayerTurnState.PLACING_SETTLEMENT;
      state.activePlayerId = nextPlayer(state);
    }
  }

  return state;
};

const actionMap: { [name: string]: ActionHandler } = {
  buildSettlement,
  buildRoad,
};

export default actionMap;
