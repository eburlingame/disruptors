import { range, shuffle } from "lodash";
import { BoardType, GameBoard, PortResource, TileType } from "./types";

const frequenciesToList = <V>(frequencies: {
  [key: string]: number;
}): string[] =>
  Object.entries(frequencies).flatMap(([key, count]) =>
    range(count).map(() => key)
  );

const variableSmallBoardTileCounts = {
  [TileType.ORE]: 3,
  [TileType.WHEAT]: 4,
  [TileType.WOOD]: 4,
  [TileType.SHEEP]: 4,
  [TileType.BRICK]: 3,
  [TileType.DESERT]: 1,
};

const variableSmallBoardDiceNumbers = [
  5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11,
];

/// This is a static "beginner" board that comes straight out of the directions (for 2-4 players)
export const generateStaticSmallBoard = (): GameBoard => ({
  tiles: [
    // Outer ring, starting from top-left
    {
      location: { x: 0, y: 2, z: -2 },
      diceNumber: 10,
      tileType: TileType.ORE,
      ports: [
        { vertexIndex: 0, resource: PortResource.ANY, ratio: 3 },
        { vertexIndex: 5, resource: PortResource.ANY, ratio: 3 },
      ],
    },
    {
      location: { x: -1, y: 2, z: -1 },
      diceNumber: 12,
      tileType: TileType.WHEAT,
      ports: [
        { vertexIndex: 5, resource: PortResource.WOOD, ratio: 2 },
        { vertexIndex: 4, resource: PortResource.WOOD, ratio: 2 },
      ],
    },
    {
      location: { x: -2, y: 2, z: 0 },
      diceNumber: 9,
      tileType: TileType.WHEAT,
      ports: [
        { vertexIndex: 0, resource: PortResource.WOOD, ratio: 2 },
        { vertexIndex: 3, resource: PortResource.BRICK, ratio: 2 },
      ],
    },
    {
      location: { x: -2, y: 1, z: 1 },
      diceNumber: 8,
      tileType: TileType.WOOD,
      ports: [
        { vertexIndex: 4, resource: PortResource.BRICK, ratio: 2 },
        { vertexIndex: 5, resource: PortResource.BRICK, ratio: 2 },
      ],
    },
    {
      location: { x: -2, y: 0, z: 2 },
      diceNumber: 5,
      tileType: TileType.BRICK,
      ports: [
        { vertexIndex: 3, resource: PortResource.ANY, ratio: 3 },
        { vertexIndex: 4, resource: PortResource.ANY, ratio: 3 },
      ],
    },
    {
      location: { x: -1, y: -1, z: 2 },
      diceNumber: 6,
      tileType: TileType.WHEAT,
      ports: [
        { vertexIndex: 2, resource: PortResource.ANY, ratio: 3 },
        { vertexIndex: 3, resource: PortResource.ANY, ratio: 3 },
      ],
    },
    {
      location: { x: 0, y: -2, z: 2 },
      diceNumber: 11,
      tileType: TileType.SHEEP,
      ports: [
        { vertexIndex: 1, resource: PortResource.SHEEP, ratio: 2 },
        { vertexIndex: 4, resource: PortResource.ANY, ratio: 3 },
      ],
    },
    {
      location: { x: 1, y: -2, z: 1 },
      diceNumber: 5,
      tileType: TileType.SHEEP,
      ports: [
        { vertexIndex: 2, resource: PortResource.SHEEP, ratio: 2 },
        { vertexIndex: 3, resource: PortResource.SHEEP, ratio: 2 },
      ],
    },
    {
      location: { x: 2, y: -2, z: 0 },
      diceNumber: 8,
      tileType: TileType.ORE,
      ports: [
        { vertexIndex: 1, resource: PortResource.ANY, ratio: 3 },
        { vertexIndex: 2, resource: PortResource.ANY, ratio: 3 },
      ],
    },
    {
      location: { x: 2, y: -1, z: -1 },
      diceNumber: 10,
      tileType: TileType.BRICK,
      ports: [
        { vertexIndex: 0, resource: PortResource.ORE, ratio: 2 },
        { vertexIndex: 1, resource: PortResource.ORE, ratio: 2 },
      ],
    },
    {
      location: { x: 2, y: 0, z: -2 },
      diceNumber: 9,
      tileType: TileType.WOOD,
      ports: [
        { vertexIndex: 2, resource: PortResource.ORE, ratio: 2 },
        { vertexIndex: 5, resource: PortResource.WHEAT, ratio: 2 },
      ],
    },
    {
      location: { x: 1, y: 1, z: -2 },
      diceNumber: 2,
      tileType: TileType.SHEEP,
      ports: [
        { vertexIndex: 0, resource: PortResource.WHEAT, ratio: 2 },
        { vertexIndex: 1, resource: PortResource.WHEAT, ratio: 2 },
      ],
    },
    // Inner ring
    {
      location: { x: 0, y: 1, z: -1 },
      diceNumber: 6,
      tileType: TileType.BRICK,
      ports: [],
    },
    {
      location: { x: -1, y: 1, z: 0 },
      diceNumber: 11,
      tileType: TileType.WOOD,
      ports: [],
    },
    {
      location: { x: -1, y: 0, z: 1 },
      diceNumber: 3,
      tileType: TileType.ORE,
      ports: [],
    },
    {
      location: { x: 0, y: -1, z: 1 },
      diceNumber: 4,
      tileType: TileType.WHEAT,
      ports: [],
    },
    {
      location: { x: 1, y: -1, z: 0 },
      diceNumber: 3,
      tileType: TileType.WOOD,
      ports: [],
    },
    {
      location: { x: 1, y: 0, z: -1 },
      diceNumber: 4,
      tileType: TileType.SHEEP,
      ports: [],
    },
    // Center
    {
      location: { x: 0, y: 0, z: 0 },
      diceNumber: -1,
      tileType: TileType.DESERT,
      ports: [],
    },
  ],
});

export const generateVariableSmallBoard = () => {
  const { tiles: staticTiles } = generateStaticSmallBoard();

  const shuffledTiles = shuffle(
    frequenciesToList(variableSmallBoardTileCounts).map(
      (tileType) => tileType as TileType
    )
  );

  let diceNumberIndex = 0;

  const variableTiles = staticTiles.map((tile, index) => {
    const tileType = shuffledTiles[index];

    if (tileType === TileType.DESERT) {
      return {
        ...tile,
        tileType,
      };
    }

    return {
      ...tile,
      tileType,
      diceNumber: variableSmallBoardDiceNumbers[diceNumberIndex++],
    };
  });

  return {
    tiles: variableTiles,
  };
};

/// This is a static "beginner" board that comes straight out of the directions (for 5-6 players)
export const generateStaticLargeBoard = (): GameBoard => ({
  tiles: [
    // Outer ring, starting from top-right
    {
      location: { x: 2, y: 0, z: -2 },
      diceNumber: 2,
      tileType: TileType.WHEAT,
      ports: [],
    },
    {
      location: { x: 1, y: 1, z: -2 },
      diceNumber: 5,
      tileType: TileType.SHEEP,
      ports: [],
    },
    {
      location: { x: 0, y: 2, z: -2 },
      diceNumber: 4,
      tileType: TileType.WOOD,
      ports: [],
    },
    {
      location: { x: -1, y: 2, z: -1 },
      diceNumber: 6,
      tileType: TileType.ORE,
      ports: [],
    },
    {
      location: { x: -2, y: 2, z: 0 },
      diceNumber: -1,
      tileType: TileType.DESERT,
      ports: [],
    },
    {
      location: { x: -3, y: 2, z: 1 },
      diceNumber: 3,
      tileType: TileType.WHEAT,
      ports: [],
    },
    {
      location: { x: -3, y: 1, z: 2 },
      diceNumber: 9,
      tileType: TileType.SHEEP,
      ports: [],
    },
    {
      location: { x: -3, y: 0, z: 3 },
      diceNumber: 8,
      tileType: TileType.BRICK,
      ports: [],
    },
    {
      location: { x: -3, y: -1, z: 4 },
      diceNumber: 11,
      tileType: TileType.ORE,
      ports: [],
    },
    {
      location: { x: -2, y: -2, z: 4 },
      diceNumber: 11,
      tileType: TileType.WHEAT,
      ports: [],
    },
    {
      location: { x: -1, y: -3, z: 4 },
      diceNumber: 10,
      tileType: TileType.WOOD,
      ports: [],
    },
    {
      location: { x: 0, y: -3, z: 3 },
      diceNumber: 6,
      tileType: TileType.ORE,
      ports: [],
    },
    {
      location: { x: 1, y: -3, z: 2 },
      diceNumber: 3,
      tileType: TileType.SHEEP,
      ports: [],
    },
    {
      location: { x: 2, y: -3, z: 1 },
      diceNumber: 8,
      tileType: TileType.WOOD,
      ports: [],
    },
    {
      location: { x: 2, y: -2, z: 0 },
      diceNumber: 4,
      tileType: TileType.WHEAT,
      ports: [],
    },
    {
      location: { x: 2, y: -1, z: -1 },
      diceNumber: 8,
      tileType: TileType.SHEEP,
      ports: [],
    },

    // Middle ring
    {
      location: { x: 1, y: 0, z: -1 },
      diceNumber: 10,
      tileType: TileType.BRICK,
      ports: [],
    },
    {
      location: { x: 0, y: 1, z: -1 },
      diceNumber: 11,
      tileType: TileType.ORE,
      ports: [],
    },
    {
      location: { x: -1, y: 1, z: 0 },
      diceNumber: 12,
      tileType: TileType.WOOD,
      ports: [],
    },
    {
      location: { x: -2, y: 1, z: 1 },
      diceNumber: 10,
      tileType: TileType.WOOD,
      ports: [],
    },
    {
      location: { x: -2, y: 0, z: 2 },
      diceNumber: 5,
      tileType: TileType.ORE,
      ports: [],
    },
    {
      location: { x: -2, y: -1, z: 3 },
      diceNumber: 4,
      tileType: TileType.SHEEP,
      ports: [],
    },
    {
      location: { x: -1, y: -2, z: 3 },
      diceNumber: 9,
      tileType: TileType.SHEEP,
      ports: [],
    },
    {
      location: { x: 0, y: -2, z: 2 },
      diceNumber: -1,
      tileType: TileType.DESERT,
      ports: [],
    },
    {
      location: { x: 1, y: -2, z: 1 },
      diceNumber: 5,
      tileType: TileType.BRICK,
      ports: [],
    },
    {
      location: { x: 1, y: -1, z: 0 },
      diceNumber: 9,
      tileType: TileType.WOOD,
      ports: [],
    },

    // Inner four
    {
      location: { x: 0, y: 0, z: 0 },
      diceNumber: 12,
      tileType: TileType.WHEAT,
      ports: [],
    },
    {
      location: { x: -1, y: 0, z: 1 },
      diceNumber: 3,
      tileType: TileType.ORE,
      ports: [],
    },
    {
      location: { x: -1, y: -1, z: 2 },
      diceNumber: 12,
      tileType: TileType.WHEAT,
      ports: [],
    },
    {
      location: { x: 0, y: -1, z: 1 },
      diceNumber: 6,
      tileType: TileType.BRICK,
      ports: [],
    },
  ],
});

export const generateBoard = (boardType: BoardType) => {
  if (boardType === BoardType.STATIC_SMALL) {
    return generateStaticSmallBoard();
  }
  if (boardType === BoardType.VARIABLE_SMALL) {
    return generateVariableSmallBoard();
  }
  if (boardType === BoardType.STATIC_LARGE) {
    return generateStaticLargeBoard();
  }
  // TODO: Make this the variable generate
  return generateStaticLargeBoard();
};
