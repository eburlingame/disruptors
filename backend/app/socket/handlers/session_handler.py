from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union
from app.socket.handler import Handler
from app.socket.types import *
from app.persistor import Persistor
from app.session import Session
from aioredis import Redis
from app.util import gen_uuid, gen_game_code


class SessionHandler(Handler):
    def __init__(self, app: FastAPI, session: Session, persistor: Persistor):
        self.app = app
        self.persistor = persistor
        self.session = session

    def sucess_response(self, request: SocketRequest, response_data):
        return SocketResponse(
            reqId=request.reqId, sucess=True, v=request.v, d=response_data
        )

    async def process_request(
        self, req: SocketRequest
    ) -> Union[SocketResponse, UnknownError]:
        self.app.logger.info("Processing request: %s" % req.json())

        response = None

        if req.v == "session.open":
            self.app.logger.info("Opening session")
            response = await self.open_session(req=req)

        elif req.v == "session.createGame":
            self.app.logger.info("Creating game")
            response = await self.create_game(req=req)

        return response

    async def open_session(self, req: SocketRequest):
        session_id = None

        # Try to lookup the session id (if one was passed in)
        if req.d:
            contents = OpenSessionPayload.parse_obj(req.d)
            session_id = await self.session.open_existing_session(
                session_id=contents.sessionId
            )
        else:
            session_id = await self.session.open_new_session()

        return self.sucess_response(req, {"sessionId": session_id})
