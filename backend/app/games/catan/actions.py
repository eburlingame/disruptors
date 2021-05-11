import random
from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from pydantic.error_wrappers import ValidationError

from app.games.catan.state import *
from app.games.catan.constants import *
from app.games.catan.gen_board import *
from app.games.catan.errors import *


def parse_action(serialized_action: dict):
    actions = {"startGame": StartGame}

    if "name" not in serialized_action:
        raise ActionParseError("Invalid action defintition")

    action_name = serialized_action["name"]
    if action_name in actions:
        try:
            clazz = actions[action_name]
            parsed = clazz.parse_obj(serialized_action)

        except ValidationError as e:
            raise ActionParseError("Invalid {action_name}: {e}")

        return parsed

    raise ActionParseError("Unknown action '{action_name}'")


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
