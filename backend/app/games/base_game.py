from typing import Any


class BaseGame:
    # Called when a game is created to get the default game configuration
    def new_game_config(self) -> Any:
        raise Exception("Unimplemented")

    # Called when the players or game options have been modified
    def update_game_config(self, player_ids: List[str], new_game_config: Any) -> Any:
        raise Exception("Unimplemented")

    # Called after the players/game options have been changes and determines whether game can be started
    def ready_to_start(self, player_ids: List[str], new_game_config: Any) -> bool:
        raise Exception("Unimplemented")

    # Called when the host starts the game. Should return an initial game state
    def start_game(self, player_ids: List[str], game_config: Any) -> Any:
        raise Exception("Unimplemented")

    # Called to dispatch an action into the game state, and returns a new state
    def dispatch_game_action(self, game: Any, player_id: str, action: Any):
        raise Exception("Unimplemented")
