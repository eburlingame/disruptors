import { GamePlayer } from "../model";

export enum GamePhase {
  SETUP_ROUND_1 = "setup1",
  SETUP_ROUND_2 = "setup2",
  PLAYER = "playing",
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

export type CatanAction = {};

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

export type CatanPlayer = GamePlayer & {
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
  totalResourceCards: number;
  totalDevelopmentCards: number;
  points: number;
};

export type CatanState = {
  config: CatanConfig;
  phase: GamePhase;
  board: GameBoard;
  players: CatanPlayer[];
  bank: Bank;
};

/// The state that is seen by any given player
export type CatanPlayersState = {
  config: CatanConfig;
  phase: GamePhase;
  board: GameBoard;
  you: CatanPlayer;
  players: CatanOtherPlayer[];
  bank: Bank;
};
