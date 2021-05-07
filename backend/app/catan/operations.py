from app.catan.constants import *
from app.catan.gen_board import *
from app.catan.actions import *
from app.catan.errors import *


def newGame(gameId: str, playerIds: List[str], gameConfig: GameConfig):
    gamePlayers = list(map(lambda playerId: GamePlayer(playerId=playerId), playerIds))

    return GameState(
        id=gameId,
        phase=GamePhase.CREATED,
        board=fixedBoard(),
        config=gameConfig,
        players=gamePlayers,
    )


def dispatchGameAction(game: GameState, playerId: str, action: GameAction):
    return action.apply(game, playerId)
