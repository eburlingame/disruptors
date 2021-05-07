from enum import Enum


class GamePhase(Enum):
    CREATED = "created"
    SETUP_ROUND_1 = "setup_1"
    SETUP_ROUND_2 = "setup_2"
    PLAYING = "playing"
    ROBBER_ROLLED = "robber"
    GAME_OVER = "game_over"


class ResourceType(Enum):
    BRICK = "brick"
    WOOD = "wood"
    ORE = "ore"
    WHEAT = "wheat"
    SHEEP = "sheep"


class TileType(Enum):
    BRICK = "brick"
    WOOD = "wood"
    ORE = "ore"
    WHEAT = "wheat"
    SHEEP = "sheep"
    DESERT = "desert"


class PortResource(Enum):
    BRICK = "brick"
    WOOD = "wood"
    ORE = "ore"
    WHEAT = "wheat"
    SHEEP = "sheep"
    ANY = "any"
