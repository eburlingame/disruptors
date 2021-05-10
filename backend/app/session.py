from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union

from app.util import gen_uuid
from app.socket.types import *
from app.persistor import Persistor


class Session:
    def __init__(self, app: FastAPI, persistor: Persistor):
        self.app = app
        self.persistor = persistor
        self.state = None

    async def open_new_session(self) -> str:
        self.app.logger.info("Creating new session")

        session = PersistedSession(
            sessionId=gen_uuid(), playerId=None, activeGameId=None
        )

        await self.persistor.put_session(session)
        self.state = session

        return session.sessionId

    async def open_existing_session(self, session_id: str) -> str:
        self.app.logger.info("Finding existing session with id %s" % session_id)
        session = await self.persistor.get_session(session_id=session_id)

        session_id = None

        if session:
            session_id = session.sessionId
        else:
            session_id = await self.open_new_session()

        return session_id

    async def attach_game(self, game_id: str):
        self.app.logger.info("Attaching game to session %s" % game_id)
        self.state.activeGameId = game_id

        await self.persistor.put_session(self.state)

    async def attach_player(self, player_id: str):
        self.app.logger.info("Attaching player to session %s" % player_id)
        self.state.playerId = player_id

        await self.persistor.put_session(self.state)
