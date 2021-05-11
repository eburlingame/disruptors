from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.games.catan.constants import *
from app.games.catan.board import *


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
    edge_index: int


# Vertex indexes:
#      0
#  5  / \ 1
#    |   |
#   4 \ / 2
#      3


class VertexCoordinate(BaseModel):
    tile: TileCoordinate
    vertex_index: int


class Port(BaseModel):
    vertex_index: int
    resource: PortResource
    ratio: int


class GameTile(BaseModel):
    location: TileCoordinate
    tile_type: TileType
    ports: List[Port] = []
    dice_number: int


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
