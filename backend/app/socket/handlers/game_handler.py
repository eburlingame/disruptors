from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union
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

        if req.v == "game.create":
            self.app.logger.info("Creating game")
            response = await self.create_game(req=req)

        return response

    async def create_game(self, req: SocketRequest):
        game_room_id = gen_uuid()
        game_room_code = gen_room_code()
        host_player_id = gen_uuid()

        game_class = games_by_name["Catan"]
        game = game_class()

        game_room = PersistedGameRoom(
            game="Catan",
            roomId=game_room_id,
            gameRoomCode=game_room_code,
            gameConfig=game.new_game_config(),
            playerIds=[PersistedGamePlayer(playerId=host_player_id, isHost=True)],
        )

        await self.persistor.put_room(room=game_room)

        await self.session.join_room(
            player_id=host_player_id, game_room_id=game_room_id
        )

        return self.sucess_response(
            request=req,
            response_data={
                "gameRoomId": game_room_id,
                "gameRoomCode": game_room_code,
                "playerId": host_player_id,
            },
        )
