from app.games.base_game import BaseGame

from app.games.catan.constants import *
from app.games.catan.gen_board import *
from app.games.catan.actions import *
from app.games.catan.errors import *


class Catan(BaseGame):
    # Called when a game is created to get the default game configuration
    def new_game_config(self) -> GameConfig:
        return GameConfig()

    # Called when the players or game options have been modified
    def update_game_config(
        self, player_ids: List[str], new_game_config: GameConfig
    ) -> GameConfig:
        pass

    # Called after the players/game options have been changes and determines whether game can be started
    def ready_to_start(
        self, player_ids: List[str], new_game_config: GameConfig
    ) -> bool:
        return True

    # Called when the host starts the game
    def start_game(self, player_ids: List[str], game_config: GameConfig) -> GameState:
        game_players = list(
            map(lambda player_id: GamePlayer(player_id=player_id), player_ids)
        )

        return GameState(
            id=gameId,
            phase=GamePhase.CREATED,
            board=fixedBoard(),
            config=game_config,
            players=game_players,
        )

    def dispatch_game_action(self, game: GameState, player_id: str, action: GameAction):
        return action.apply(game, player_id)
