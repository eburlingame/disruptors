from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from constants import *

tile_neighbors = [
    TileCoordinate(1, -1, 0),
    TileCoordinate(1, 0, -1),
    TileCoordinate(0, 1, -1),
    TileCoordinate(-1, 1, 0),
    TileCoordinate(-1, 0, +1),
    TileCoordinate(0, -1, +1),
]


class TileCoordinate(BaseModel):
    x: int
    y: int
    z: int


# Edge indexes:
#  5         0
#      / \
#  4  |   |  1
#      \ /
#  3         2


class EdgeCoordinate(BaseModel):
    tile: TileCoordinate
    edgeIndex: int


# Vertex indexes:
#      0
#  5  / \ 1
#    |   |
#   4 \ / 2
#      3


class VertexCoordinate(BaseModel):
    tile: TileCoordinate
    vertexIndex: int


class Port(BaseModel):
    resource: PortResource
    ratio: int


class GameTile(BaseModel):
    location: TileCoordinate
    tileType: TileType
    ports: List[Port] = []


class GameBoard(BaseModel):
    tiles: List[GameTile] = []
