import random
from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from pydantic.error_wrappers import ValidationError

from app.catan.state import *
from app.catan.constants import *
from app.catan.gen_board import *
from app.catan.errors import *


def parseAction(serializedAction: dict):
    actions = {"startGame": StartGame}

    if "name" not in serializedAction:
        raise ActionParseError("Invalid action defintition")

    actionName = serializedAction["name"]
    if actionName in actions:
        try:
            clazz = actions[actionName]
            parsed = clazz.parse_obj(serializedAction)

        except ValidationError as e:
            raise ActionParseError("Invalid {actionName}: {e}")

        return parsed

    raise ActionParseError("Unknown action '{actionName}'")


class GameAction(BaseModel):
    actionId: str
    name: str

    def apply(self, game: GameState, playerId: str):
        raise Exception("Unimplemented")


class StartGame(GameAction):
    name: str = "startGame"

    def apply(self, game: GameState, playerId: str):
        if game.phase == GamePhase.CREATED:
            random.shuffle(game.players)
            game.phase = GamePhase.SETUP_ROUND_1

            return game

        raise GameException("Can't start game that's already started")
