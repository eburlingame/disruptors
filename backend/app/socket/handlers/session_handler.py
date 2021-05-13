from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union
from app.socket.base_handler import BaseHandler
from app.socket.types import *
from app.persistor import Persistor
from app.session import Session
from app.util import gen_uuid


class SessionHandler(BaseHandler):
    def __init__(self, app: FastAPI, session: Session, persistor: Persistor):
        self.app = app
        self.persistor = persistor
        self.session = session

    async def check_for_updates(self) -> Union[BaseModel, None]:
        return None

    async def process_request(self, req: SocketRequest) -> BaseModel:
        self.app.logger.info("Processing request: %s" % req.json())

        response = None

        if req.v == "session.open":
            self.app.logger.info("Opening session")
            response = await self.open_session(req=req)

        return response

    async def open_session(self, req: SocketRequest) -> SocketResponse:
        session_id = None

        # Try to lookup the session id (if one was passed in)
        if req.d:
            contents = OpenSessionPayload.parse_obj(req.d)
            session_id = await self.session.open_existing_session(contents.sessionId)
        else:
            session_id = await self.session.open_new_session()

        roomData = None
        if self.session.state.gameRoomCode:
            room = await self.persistor.get_room(self.session.state.gameRoomCode)

            roomData = {
                "gameRoomCode": room.gameRoomCode,
                "players": room.players,
            }

        return self.sucess_response(
            req,
            {
                "sessionId": session_id,
                "playerId": self.session.state.playerId,
                "room": roomData,
            },
        )
