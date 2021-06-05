import { GamePlayer } from "./model";

export enum GamePhase {
  SETUP_ROUND_1 = "setup1",
  SETUP_ROUND_2 = "setup2",
  PLAYING = "playing",
  ROBBER_ROLLER = "robber_rolled",
}

export type TileCoordinate = {
  x: number;
  y: number;
  z: number;
};

///     Edge indexes:
///       5      0
///          / \
///      4  |   |  1
///          \ /
///       3       2

export type EdgeCoordinate = {
  tile: TileCoordinate;
  edgeIndex: number;
};

///     Vertex indexes:
///          0
///      5  / \ 1
///        |   |
///       4 \ / 2
///          3

export type VertexCoordinate = {
  tile: TileCoordinate;
  vertexIndex: number;
};

export enum ResourceType {
  BRICK = "brick",
  WOOD = "wood",
  ORE = "ore",
  WHEAT = "wheat",
  SHEEP = "sheep",
}

export enum PortResource {
  BRICK = "brick",
  WOOD = "wood",
  ORE = "ore",
  WHEAT = "wheat",
  SHEEP = "sheep",
  ANY = "any",
}

export type Port = {
  vertexIndex: number;
  resource: PortResource;
  ratio: number;
};

export enum TileType {
  BRICK = "brick",
  WOOD = "wood",
  ORE = "ore",
  WHEAT = "wheat",
  SHEEP = "sheep",
  DESERT = "desert",
}

export type GameTile = {
  location: TileCoordinate;
  tileType: TileType;
  ports: Port[];
  diceNumber: number;
};

export type GameBoard = {
  tiles: GameTile[];
};

export type BuildSettlementAction = {
  name: "buildSettlement";
  location: VertexCoordinate;
};

export type BuildCityAction = {
  name: "buildCity";
  location: VertexCoordinate;
};

export type BuildRoadAction = {
  name: "buildRoad";
  location: EdgeCoordinate;
};

export type RollDiceAction = {
  name: "rollDice";
  values: [number, number];
};

export type TurnAction = "buildSettlement" | "buildCity" | "buildRoad" | "idle";

export type ChangeTurnAction = {
  name: "changeTurnAction";
  turnAction: TurnAction;
};

export type EndTurnAction = {
  name: "endTurn";
};

export type CatanAction =
  | BuildSettlementAction
  | BuildSettlementAction
  | BuildRoadAction
  | RollDiceAction
  | ChangeTurnAction
  | EndTurnAction;

export type CatanConfig = {
  cardDiscardLimit: number;
};

export type DevelopmentCard = {
  name: string;
};

export type Bank = {
  brick: number;
  wood: number;
  ore: number;
  wheat: number;
  sheep: number;
  developmentCards: DevelopmentCard[];
};

export enum BuildingType {
  Settlement = "settlement",
  City = "city",
}

export enum PlayerTurnState {
  IDLE = "idle",
  MUST_ROLL = "mustRoll",
  PLACING_SETTLEMENT = "placingSettlement",
  PLACING_CITY = "placingCity",
  PLACING_ROAD = "placingRoad",
}

export type Building = {
  location: VertexCoordinate;
  type: BuildingType;
  playerId: string; // owner
};

export type Road = {
  location: EdgeCoordinate;
  playerId: string; // owner
};

export enum PlayerColor {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Orange = "orange",
  Purple = "purple",
  Teal = "teal",
}

export type CatanPlayer = GamePlayer & {
  color: PlayerColor;
  resources: {
    brick: number;
    wood: number;
    ore: number;
    wheat: number;
    sheep: number;
  };
  developmentCards: DevelopmentCard[];
};

export type CatanOtherPlayer = GamePlayer & {
  color: PlayerColor;
  totalResourceCards: number;
  totalDevelopmentCards: number;
  points: number;
};

export type CatanState = {
  config: CatanConfig;
  phase: GamePhase;
  board: GameBoard;
  buildings: Building[];
  roads: Road[];
  bank: Bank;
  players: CatanPlayer[];
  activePlayerId: string;
  activePlayerTurnState: PlayerTurnState;
};

/// The state that is seen by any given player
export type CatanPlayersState = {
  config: CatanConfig;
  phase: GamePhase;
  board: GameBoard;
  buildings: Building[];
  roads: Road[];
  bank: Bank;
  you: CatanPlayer;
  players: CatanOtherPlayer[];
  activePlayerId: string;
  activePlayerTurnState: PlayerTurnState;
};
