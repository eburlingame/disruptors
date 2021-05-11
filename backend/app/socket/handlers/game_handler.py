from typing import Any, Union
from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from aioredis import Redis

from app.games.load import games_by_name
from app.socket.base_handler import BaseHandler
from app.socket.types import *
from app.persistor import Persistor
from app.session import Session
from app.util import gen_uuid, gen_room_code


class GameHandler(BaseHandler):
    def __init__(self, app: FastAPI, session: Session, persistor: Persistor):
        self.app = app
        self.persistor = persistor
        self.session = session

    async def process_request(
        self, req: SocketRequest
    ) -> Union[SocketResponse, UnknownError]:
        self.app.logger.info("Processing request: %s" % req.json())

        response = None

        if req.v == "game.start":
            self.app.logger.info("Creating game")
            response = await self.start_game(req=req)

        return response

    async def start_game(self, req: SocketRequest):
        pass
