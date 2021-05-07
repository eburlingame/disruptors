import pytest
from httpx import AsyncClient
import fakeredis.aioredis
from fastapi import status

from app.catan.gen_board import fixedBoard
from app.catan.operations import *


def test_gen_fixed_board():
    board = fixedBoard()
    assert board.tiles[0].diceNumber == 10
    assert len(board.tiles) == 19

    # Ensure the coordinates are valid
    for tile in board.tiles:
        assert tile.location.x + tile.location.y + tile.location.z == 0


def genericGame():
    return newGame(gameId="abcd", gameConfig=GameConfig(), playerIds=["player1"])


def assert_new_game(game):
    assert game.id == "abcd"
    assert len(game.players) == 1
    assert game.config.cardDiscardLimit == 7
    assert game.board.tiles[0].diceNumber == 10
    assert len(game.board.tiles) == 19


def test_new_game():
    game = genericGame()
    assert_new_game(game)


def test_serialize_new_game():
    game = genericGame()

    serialized = game.json()
    deserialized = GameState.parse_raw(serialized)

    assert_new_game(deserialized)


def test_start_game():
    game = genericGame()

    action = parseAction({"actionId": "1234", "name": "startGame"})
    game = dispatchGameAction(game, "player1", action)

    assert game.phase == GamePhase.SETUP_ROUND_1


def test_parse_action():
    # Valid action
    action = parseAction({"actionId": "1234", "name": "startGame"})
    assert action.actionId == "1234"
    assert action.name == "startGame"

    # Missing name
    with pytest.raises(ActionParseError):
        action = parseAction({"actionId": "1234"})

    # Missing id
    with pytest.raises(ActionParseError):
        action = parseAction({"name": "startGame"})
