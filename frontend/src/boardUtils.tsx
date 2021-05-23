import { GameTile, TileCoordinate } from "./state/game_types";

export const locationToPosition = ({ x, y, z }: TileCoordinate) => ({
  x: x - y,
  y: -z,
});

export enum EdgeDir {
  NE = 0,
  E = 1,
  SE = 2,
  SW = 3,
  W = 4,
  NW = 5,
}

export enum VertexDir {
  N = 0,
  NE = 1,
  SE = 2,
  S = 3,
  SW = 4,
  NW = 5,
}

export const edgeVectors: TileCoordinate[] = [
  { x: 1, y: 0, z: -1 }, /// NE
  { x: 1, y: -1, z: 0 }, /// E
  { x: 0, y: -1, z: 1 }, /// SE
  { x: -1, y: 0, z: 1 }, /// SW
  { x: -1, y: 1, z: 0 }, /// W
  { x: 0, y: 1, z: -1 }, /// NW
];

export const addVectors = (
  a: TileCoordinate,
  b: TileCoordinate
): TileCoordinate => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

export const vectorsEqual = (a: TileCoordinate, b: TileCoordinate): boolean =>
  a.x === b.x && a.y === b.y && a.z === b.z;

export const tileAlongEdge = (
  position: TileCoordinate,
  edgeIndex: number
): TileCoordinate => {
  const delta = edgeVectors[edgeIndex];
  return addVectors(position, delta);
};

export const hasTile = (tiles: GameTile[], position: TileCoordinate): boolean =>
  !!tiles.find(({ location }) => vectorsEqual(location, position));
