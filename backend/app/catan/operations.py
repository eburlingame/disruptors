from app.catan.constants import *
from app.catan.gen_board import *
from app.catan.actions import *
from app.catan.errors import *


def new_game(gameId: str, player_ids: List[str], game_config: GameConfig):
    game_players = list(map(lambda player_id: GamePlayer(player_id=player_id), player_ids))

    return GameState(
        id=gameId,
        phase=GamePhase.CREATED,
        board=fixedBoard(),
        config=game_config,
        players=game_players,
    )


def dispatch_game_action(game: GameState, player_id: str, action: GameAction):
    return action.apply(game, player_id)
