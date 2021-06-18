import { range, sum } from "lodash";
import {
  GameTile,
  TileCoordinate,
  EdgeCoordinate,
  VertexCoordinate,
  ExchangeRate,
  PortResource,
  CatanState,
  GameBoard,
  Road,
  Building,
  ResourceType,
  TileType,
  BuildingType,
  CatanPlayer,
  ResourceDistribution,
} from "./types";

export const locationToPosition = ({ x, y, z }: TileCoordinate) => ({
  x: x - y,
  y: -z,
});

export const widthInTiles = (tiles: GameTile[]) => {
  const xPositions = tiles.map((tile) => locationToPosition(tile.location).x);

  console.log(xPositions);

  const max = Math.max(...xPositions);
  const min = Math.min(...xPositions);

  return (max - min) / 2 + 1;
};

export const heightInTiles = (tiles: GameTile[]) => {
  const yPositions = tiles.map((tile) => locationToPosition(tile.location).y);

  // console.log(yPositions);

  const max = Math.max(...yPositions);
  const min = Math.min(...yPositions);

  return max - min + 1;
};

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

export const vertexCoordinateEquivalent = (
  tiles: GameTile[],
  a: VertexCoordinate,
  b: VertexCoordinate
) =>
  vertexCoordinateEqual(
    getCommonVertexCoordinate(tiles, a),
    getCommonVertexCoordinate(tiles, b)
  );

export const edgeCoordinateEqual = (
  a: EdgeCoordinate,
  b: EdgeCoordinate
): boolean => vectorsEqual(a.tile, b.tile) && a.edgeIndex === b.edgeIndex;

export const edgeCoordinateEquivalent = (
  tiles: GameTile[],
  a: EdgeCoordinate,
  b: EdgeCoordinate
) =>
  edgeCoordinateEqual(
    getCommonEdgeCoordinate(tiles, a),
    getCommonEdgeCoordinate(tiles, b)
  );

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

/// Since each vertex coordinate can be represented in multiple ways, this returns a single representation of a
/// vertex coordinate.
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

/// Returns the edge 180 degrees behind the given edge
export const reciropcalEdges: { [index: number]: number } = {
  [EdgeDir.NE]: EdgeDir.SW,
  [EdgeDir.E]: EdgeDir.W,
  [EdgeDir.SE]: EdgeDir.NW,
  [EdgeDir.SW]: EdgeDir.NE,
  [EdgeDir.SW]: EdgeDir.NE,
  [EdgeDir.W]: EdgeDir.E,
  [EdgeDir.NW]: EdgeDir.SE,
};

/// Maps a given vertex direction to the two edges that touch that vertex
export const vertexAdjacenies: { [index: number]: EdgeDir[] } = {
  [VertexDir.N]: [EdgeDir.NW, EdgeDir.NE],
  [VertexDir.NE]: [EdgeDir.NE, EdgeDir.E],
  [VertexDir.SE]: [EdgeDir.E, EdgeDir.SE],
  [VertexDir.S]: [EdgeDir.SE, EdgeDir.SW],
  [VertexDir.SW]: [EdgeDir.SW, EdgeDir.W],
  [VertexDir.NW]: [EdgeDir.W, EdgeDir.NW],
};

/// Maps a given edge direction to its two vertex directions
export const edgeVerticies: { [index: number]: VertexDir[] } = {
  [EdgeDir.NE]: [VertexDir.N, VertexDir.NE],
  [EdgeDir.E]: [VertexDir.NE, VertexDir.SE],
  [EdgeDir.SE]: [VertexDir.SE, VertexDir.S],
  [EdgeDir.SW]: [VertexDir.S, VertexDir.SW],
  [EdgeDir.W]: [VertexDir.SW, VertexDir.NW],
  [EdgeDir.NW]: [VertexDir.NW, VertexDir.N],
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

/// Get the six verticies touching a given tile
export const tileVerticies = (tiles: GameTile[], location: TileCoordinate) => {
  return range(6).map((vertexIndex) =>
    getCommonVertexCoordinate(tiles, { tile: location, vertexIndex })
  );
};

/// Get the six edges touching a given tile
export const tileEdges = (tiles: GameTile[], location: TileCoordinate) => {
  return range(6).map((edgeIndex) =>
    getCommonEdgeCoordinate(tiles, { tile: location, edgeIndex })
  );
};

/// Return the game tiles which are touching a given vertex
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

export const edgeTouchingVertex = (
  tiles: GameTile[],
  edge: EdgeCoordinate,
  vertexCoord: VertexCoordinate
) =>
  edgeToVertices(tiles, edge).some((edgeVertex) =>
    vertexCoordinateEquivalent(tiles, edgeVertex, vertexCoord)
  );

export const edgeToVertices = (tiles: GameTile[], edge: EdgeCoordinate) => {
  const edges = edgeVerticies[edge.edgeIndex];

  return [
    getCommonVertexCoordinate(tiles, {
      tile: edge.tile,
      vertexIndex: edges[0],
    }),
    getCommonVertexCoordinate(tiles, {
      tile: edge.tile,
      vertexIndex: edges[1],
    }),
  ];
};

/// Get the two or three edges touching a given vertex
export const vertexToEdges = (tiles: GameTile[], vertex: VertexCoordinate) => {
  return tilesTouchingVertex(tiles, vertex)
    .flatMap((tile) => tileEdges(tiles, tile.location))
    .filter((edge) => edgeTouchingVertex(tiles, edge, vertex));
};

type RoadGraph = { [key: string]: Set<string> };

const vertexKey = ({ tile: { x, y, z }, vertexIndex: v }: VertexCoordinate) =>
  `${x}|${y}|${z}/${v}`;

const roadsToGraph = (state: CatanState, playerId: string): RoadGraph => {
  const { tiles } = state.board;
  const roads = state.roads.filter((road) => road.playerId === playerId);

  let graph: RoadGraph = {};

  const addVertexToGraph = (fromKey: string, toKey: string) => {
    if (fromKey in graph) {
      graph[fromKey].add(toKey);
    } else {
      graph[fromKey] = new Set([toKey]);
    }
  };

  roads.forEach(({ location }) => {
    const [vertexA, vertexB] = edgeToVertices(tiles, location);

    const keyA = vertexKey(vertexA);
    const keyB = vertexKey(vertexB);

    addVertexToGraph(keyA, keyB);
    addVertexToGraph(keyB, keyA);
  });

  return graph;
};

const longestPathFrom = (graph: RoadGraph, start: string) => {
  let stack: { node: string; depth: number }[] = [];
  let seen = new Set<string>();
  let maxDepth = 0;

  /// Perform a DFS starting from the given start node
  stack.push({ node: start, depth: 0 });

  while (stack.length > 0) {
    const edge = stack.pop();
    if (!edge) continue;

    /// Keep track of which nodes we've been to
    seen.add(edge.node);

    /// Keep track of the longest branch
    if (edge.depth > maxDepth) {
      maxDepth = edge.depth;
    }

    const neighbors = graph[edge.node];
    neighbors.forEach((neighbor) => {
      if (!seen.has(neighbor)) {
        stack.push({ node: neighbor, depth: edge.depth + 1 });
      }
    });
  }

  return maxDepth;
};

export const computeLongestRoad = (
  state: CatanState,
  playerId: string
): number => {
  const graph = roadsToGraph(state, playerId);
  const startNodes = Object.keys(graph);

  const longestRoad = Math.max(
    ...startNodes.map((start) => longestPathFrom(graph, start))
  );

  return longestRoad;
};

/// Get a list of all available exchange rate available to a player based on their proximity to ports on the game board
/// Always returns a 4:1 any ratio
export const getAvailableExchanges = (
  state: CatanState,
  playerId: string
): ExchangeRate[] => {
  const { tiles } = state.board;

  const buildings = state.buildings.filter(
    (building) => building.playerId === playerId
  );

  const allPorts = state.board.tiles.flatMap(({ ports, location }) =>
    ports.map((port) => ({
      port,
      location: { tile: location, vertexIndex: port.vertexIndex },
    }))
  );

  const usablePorts = allPorts
    .filter(({ location }) =>
      buildings.some((building) =>
        vertexCoordinateEquivalent(tiles, building.location, location)
      )
    )
    .map(({ port: { resource, ratio } }) => ({ resource, ratio }));

  return [
    { resource: PortResource.ANY, ratio: 4 }, /// default maritime trade
    ...usablePorts,
  ];
};

export const roadExists = (
  roads: Road[],
  tile: TileCoordinate,
  edgeIndex: number
) =>
  roads.find((road) =>
    edgeCoordinateEqual({ tile, edgeIndex }, road.location)
  ) != undefined;

export const buildingExists = (
  buildings: Building[],
  tile: TileCoordinate,
  vertexIndex: number
) =>
  buildings.find((building) =>
    vertexCoordinateEqual({ tile, vertexIndex }, building.location)
  ) != undefined;

/// Returns true if the given position is next to a current road that the player has built, or a building
export const isValidRoadPosition = (
  { tiles }: GameBoard,
  roads: Road[],
  buildings: Building[],
  playerId: string,
  edgeCoord: EdgeCoordinate
): boolean => {
  if (roadExists(roads, edgeCoord.tile, edgeCoord.edgeIndex)) {
    return false;
  }

  const yourRoads = roads.filter((road) => road.playerId === playerId);
  const yourBuildings = buildings.filter(
    (building) => building.playerId === playerId
  );

  const occupiedVerticies = [
    ...yourBuildings.map(({ location }) => location),
    ...yourRoads.flatMap(({ location }) => edgeToVertices(tiles, location)),
  ];

  const verticies = edgeToVertices(tiles, edgeCoord);

  const allowBuilding = verticies.some((roadEdgeVertex) =>
    occupiedVerticies.some((occupiedVertex) =>
      vertexCoordinateEquivalent(tiles, roadEdgeVertex, occupiedVertex)
    )
  );

  return allowBuilding;
};

/// Returns true if the given position is next to a current road that the player has built, or a building
export const isValidSettlementPosition = (
  { tiles }: GameBoard,
  roads: Road[],
  buildings: Building[],
  playerId: string,
  vertexCoord: VertexCoordinate,
  mustConnect: boolean = true
): boolean => {
  if (buildingExists(buildings, vertexCoord.tile, vertexCoord.vertexIndex)) {
    return false;
  }

  const yourRoads = roads.filter((road) => road.playerId === playerId);

  const connectedVerticies = yourRoads.flatMap(({ location }) =>
    edgeToVertices(tiles, location)
  );

  const isConnected = connectedVerticies.some((occupiedVertex) =>
    vertexCoordinateEquivalent(tiles, vertexCoord, occupiedVertex)
  );

  const hasBuilding = (vertex: VertexCoordinate) =>
    buildings.find((building) =>
      vertexCoordinateEquivalent(tiles, vertex, building.location)
    ) != undefined;

  const obeysDistanceRule = vertexToEdges(tiles, vertexCoord).every((edge) =>
    edgeToVertices(tiles, edge).every(
      (adjacentVertex) => !hasBuilding(adjacentVertex)
    )
  );

  if (mustConnect) {
    return isConnected && obeysDistanceRule;
  }

  return obeysDistanceRule;
};

/// Returns true if the given playerId has a building adjacent to the given robber position
export const playerHasBuildingNextToRobber = (
  tiles: GameTile[],
  robber: TileCoordinate | null,
  buildings: Building[],
  playerId: string
) => {
  if (robber) {
    const verticies = tileVerticies(tiles, robber);

    const playersBuilindgs = buildings.filter(
      (building) => building.playerId === playerId
    );

    return verticies.some((vertex) =>
      playersBuilindgs.some((building) =>
        vertexCoordinateEquivalent(tiles, vertex, building.location)
      )
    );
  }

  return false;
};

export const tileTypeToResourceType = (
  tileType: TileType
): ResourceType | undefined => {
  if (Object.values(ResourceType).includes(tileType as any)) {
    return tileType as unknown as ResourceType;
  }

  return undefined;
};

export const distributeResources = (
  tiles: GameTile[],
  robber: TileCoordinate | null,
  players: CatanPlayer[],
  buildings: Building[],
  diceTotal: number
): ResourceDistribution => {
  if (diceTotal === 7) return {};

  const distribution: ResourceDistribution = players.reduce(
    (obj, player) => ({
      ...obj,
      [player.playerId]: {
        [ResourceType.BRICK]: 0,
        [ResourceType.ORE]: 0,
        [ResourceType.WHEAT]: 0,
        [ResourceType.SHEEP]: 0,
        [ResourceType.WOOD]: 0,
      },
    }),
    {}
  );

  buildings.forEach(({ type, location, playerId: tilesPlayerId }) => {
    tilesTouchingVertex(tiles, location)
      .filter(({ diceNumber }) => diceNumber === diceTotal)
      .filter(({ location }) =>
        robber ? !vectorsEqual(location, robber) : true
      )
      .forEach((gameTile) => {
        const resourceType = tileTypeToResourceType(gameTile.tileType);

        if (resourceType) {
          if (type === BuildingType.Settlement) {
            distribution[tilesPlayerId][resourceType] += 1;
          } else if (type === BuildingType.City) {
            distribution[tilesPlayerId][resourceType] += 2;
          }
        }
      });
  });

  /// Filter out players who didn't recieve anything
  const onlyReceievers = Object.entries(distribution).reduce(
    (obj, [playerId, got]) => {
      if (sum(Object.values(got)) > 0) {
        return { ...obj, [playerId]: got };
      }
      return obj;
    },
    {}
  );

  return onlyReceievers;
};
