from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.catan.constants import *
from app.catan.board import *


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
    vertexIndex: int
    resource: PortResource
    ratio: int


class GameTile(BaseModel):
    location: TileCoordinate
    tileType: TileType
    ports: List[Port] = []
    diceNumber: int


class GameBoard(BaseModel):
    tiles: List[GameTile] = []


tile_neighbors = [
    TileCoordinate(x=1, y=-1, z=0),
    TileCoordinate(x=1, y=0, z=-1),
    TileCoordinate(x=0, y=1, z=-1),
    TileCoordinate(x=-1, y=1, z=0),
    TileCoordinate(x=-1, y=0, z=+1),
    TileCoordinate(x=0, y=-1, z=+1),
]
