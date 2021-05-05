from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from constants import *


class Road(BaseModel):
    location: EdgeCoordinate


class Settlement(BaseModel):
    location: VertexCoordinate


class City(BaseModel):
    location: VertexCoordinate


class GamePlayer(BaseModel):
    playerId: str
    roads: List[Road] = []
    settlements: List[Settlement] = []
    cities: List[City] = []


class GameConfig(BaseModel):
    cardDiscardLimit: int


class GameState(BaseModel):
    id: int
    config: GameConfig
    phase: GamePhase
    board: GameBoard
