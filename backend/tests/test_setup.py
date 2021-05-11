import pytest

from app.games.catan.gen_board import fixedBoard
from app.games.catan.game import Catan
from app.games.catan.state import GameConfig, GameState
from app.games.catan.actions import parse_action
from app.games.catan.constants import GamePhase
from app.games.catan.errors import ActionParseError


def test_gen_fixed_board():
    board = fixedBoard()
    assert board.tiles[0].dice_number == 10
    assert len(board.tiles) == 19

    # Ensure the coordinates are valid
    for tile in board.tiles:
        assert tile.location.x + tile.location.y + tile.location.z == 0


def generic_game():
    return Catan().start_game(game_config=GameConfig(), player_ids=["player1"])


def assert_new_game(game):
    assert len(game.players) == 1
    assert game.config.card_discard_limit == 7
    assert game.board.tiles[0].dice_number == 10
    assert len(game.board.tiles) == 19


def test_new_game():
    game = generic_game()
    assert_new_game(game)


def test_serialize_new_game():
    game = generic_game()

    serialized = game.json()
    deserialized = GameState.parse_raw(serialized)

    assert_new_game(deserialized)


def test_start_game():
    catan = Catan()
    game = generic_game()

    action = parse_action({"actionId": "1234", "name": "startGame"})
    game = catan.dispatch_game_action(game, "player1", action)

    assert game.phase == GamePhase.SETUP_ROUND_1


def test_parse_action():
    # Valid action
    action = parse_action({"actionId": "1234", "name": "startGame"})
    assert action.actionId == "1234"
    assert action.name == "startGame"

    # Missing name
    with pytest.raises(ActionParseError):
        action = parse_action({"actionId": "1234"})

    # Missing id
    with pytest.raises(ActionParseError):
        action = parse_action({"name": "startGame"})
