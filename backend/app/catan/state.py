from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.catan.constants import *
from app.catan.gen_board import *
from app.catan.errors import *


class Road(BaseModel):
    location: EdgeCoordinate


class Settlement(BaseModel):
    location: VertexCoordinate


class City(BaseModel):
    location: VertexCoordinate


class ResourceAmounts(BaseModel):
    wheat: int = 0
    brick: int = 0
    ore: int = 0
    sheep: int = 0
    wood: int = 0


class GamePlayer(BaseModel):
    player_id: str
    resources: ResourceAmounts = ResourceAmounts()
    roads: List[Road] = []
    settlements: List[Settlement] = []
    cities: List[City] = []


class GameConfig(BaseModel):
    card_discard_limit: int = 7


class GameState(BaseModel):
    id: str
    config: GameConfig
    phase: GamePhase
    board: GameBoard
    players: List[GamePlayer] = []
