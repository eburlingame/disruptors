from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union

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

        if not session:
            return session.sessionId

        return self.open_new_session()
