import { GameBoard, PortResource, TileType } from "./types";

/// This is a static "beginner" board that comes straight out of the directions
export const generateStaticBoard = (): GameBoard => ({
  tiles: [
    // Outer ring
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
      location: { x: 0, y: -1, z: 1 },
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
      location: { x: -1, y: -0, z: 1 },
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
