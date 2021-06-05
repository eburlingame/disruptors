import {
  GameTile,
  TileCoordinate,
  EdgeCoordinate,
  VertexCoordinate,
} from "./types";

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

export const vertexCoordinateEqual = (
  a: VertexCoordinate,
  b: VertexCoordinate
): boolean => vectorsEqual(a.tile, b.tile) && a.vertexIndex === b.vertexIndex;

export const edgeCoordinateEqual = (
  a: EdgeCoordinate,
  b: EdgeCoordinate
): boolean => vectorsEqual(a.tile, b.tile) && a.edgeIndex === b.edgeIndex;

export const tileAlongEdge = (
  position: TileCoordinate,
  edgeIndex: number
): TileCoordinate => {
  const delta = edgeVectors[edgeIndex];
  return addVectors(position, delta);
};

export const findTile = (
  tiles: GameTile[],
  position: TileCoordinate
): GameTile | undefined =>
  tiles.find(({ location }) => vectorsEqual(location, position));

export const hasTile = (tiles: GameTile[], position: TileCoordinate): boolean =>
  !!findTile(tiles, position);

export const hasTileAlongEdge = (
  tiles: GameTile[],
  tile: TileCoordinate,
  edgeIndex: number
) => hasTile(tiles, tileAlongEdge(tile, edgeIndex));

export const getCommonVertexCoordinate = (
  tiles: GameTile[],
  vertexCoord: VertexCoordinate
): VertexCoordinate => {
  const { tile, vertexIndex } = vertexCoord;

  /// The top and bottom vertex should use their own coordinate
  if (vertexIndex === VertexDir.N || vertexIndex === VertexDir.S) {
    return vertexCoord;
  }

  if (vertexIndex === VertexDir.NE) {
    if (hasTileAlongEdge(tiles, tile, EdgeDir.NE)) {
      return {
        tile: tileAlongEdge(tile, EdgeDir.NE),
        vertexIndex: VertexDir.S,
      };
    }
  }

  if (vertexIndex === VertexDir.SE) {
    if (hasTileAlongEdge(tiles, tile, EdgeDir.SE)) {
      return {
        tile: tileAlongEdge(tile, EdgeDir.SE),
        vertexIndex: VertexDir.N,
      };
    }
  }

  /// Let the squares to the left draw the left verticies, if they exist
  if (vertexIndex === VertexDir.SW) {
    if (hasTileAlongEdge(tiles, tile, EdgeDir.SW)) {
      return {
        tile: tileAlongEdge(tile, EdgeDir.SW),
        vertexIndex: VertexDir.N,
      };
    }

    if (hasTileAlongEdge(tiles, tile, EdgeDir.W)) {
      return {
        tile: tileAlongEdge(tile, EdgeDir.W),
        vertexIndex: VertexDir.SE,
      };
    }
  }

  if (vertexIndex === VertexDir.NW) {
    if (hasTileAlongEdge(tiles, tile, EdgeDir.NW)) {
      return {
        tile: tileAlongEdge(tile, EdgeDir.NW),
        vertexIndex: VertexDir.S,
      };
    }

    if (hasTileAlongEdge(tiles, tile, EdgeDir.W)) {
      return {
        tile: tileAlongEdge(tile, EdgeDir.W),
        vertexIndex: VertexDir.NE,
      };
    }
  }

  return vertexCoord;
};

export const reciropcalEdges: { [index: number]: number } = {
  [EdgeDir.NE]: EdgeDir.SW,
  [EdgeDir.E]: EdgeDir.W,
  [EdgeDir.SE]: EdgeDir.NW,
  [EdgeDir.SW]: EdgeDir.NE,
  [EdgeDir.SW]: EdgeDir.NE,
  [EdgeDir.W]: EdgeDir.E,
  [EdgeDir.NW]: EdgeDir.SE,
};

export const vertexAdjacenies: { [index: number]: EdgeDir[] } = {
  [VertexDir.N]: [EdgeDir.NW, EdgeDir.NE],
  [VertexDir.NE]: [EdgeDir.NE, EdgeDir.E],
  [VertexDir.SE]: [EdgeDir.E, EdgeDir.SE],
  [VertexDir.S]: [EdgeDir.SE, EdgeDir.SW],
  [VertexDir.SW]: [EdgeDir.SW, EdgeDir.W],
  [VertexDir.NW]: [EdgeDir.W, EdgeDir.NW],
};

/// Since two tiles can touch each edge, decide which one should draw the vertex button/label
export const getCommonEdgeCoordinate = (
  tiles: GameTile[],
  edgeCoord: EdgeCoordinate
): EdgeCoordinate => {
  const { tile, edgeIndex } = edgeCoord;

  /// Always draw the right edges
  if (
    edgeIndex === EdgeDir.NE ||
    edgeIndex === EdgeDir.E ||
    edgeIndex === EdgeDir.SE
  ) {
    return edgeCoord;
  }
  /// Only draw the left edges if there isn't a tile to the left
  else if (hasTileAlongEdge(tiles, tile, edgeIndex)) {
    return {
      tile: tileAlongEdge(tile, edgeIndex),
      edgeIndex: reciropcalEdges[edgeIndex],
    };
  }

  return edgeCoord;
};

export const tilesTouchingVertex = (
  tiles: GameTile[],
  vertexCoord: VertexCoordinate
): GameTile[] => {
  const common = getCommonVertexCoordinate(tiles, vertexCoord);
  const commonTile = findTile(tiles, common.tile);

  if (!commonTile) throw new Error("Invalid tile?");

  const edges = vertexAdjacenies[common.vertexIndex];

  const otherTiles: any[] = edges
    .map((edgeIndex) => findTile(tiles, tileAlongEdge(common.tile, edgeIndex)))
    .filter((t) => t !== undefined);

  return [commonTile, ...otherTiles];
};
