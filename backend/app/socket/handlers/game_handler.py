from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union
from aioredis import Redis

from app.socket.handler import Handler
from app.socket.types import *
from app.persistor import Persistor
from app.session import Session
from app.util import gen_uuid, gen_game_code


class GameHandler(Handler):
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

        if req.v == "game.create":
            self.app.logger.info("Creating game")
            response = await self.create_game(req=req)

        return response

    async def create_game(self, req: SocketRequest):
        # Create game id
        # Create game code
        # Create player id
        # Create default game configuration
        # Persist new game
        # Attach it to the session
        # Attach player id to the session
        pass
