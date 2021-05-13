from typing import Any, Union
from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from redis import Redis

from app.games.load import games_by_name
from app.socket.base_handler import BaseHandler
from app.socket.types import *
from app.persistor import Persistor
from app.session import Session
from app.util import gen_uuid, gen_room_code


class CreateRoomPayload(BaseModel):
    gameName: Optional[str]


class JoinRoomPayload(BaseModel):
    gameRoomCode: str


def player_in_room(players: List[PersistedGamePlayer], player_id: str):
    return any(map(lambda player: player.playerId == player_id, players))


class RoomHandler(BaseHandler):
    def __init__(self, app: FastAPI, session: Session, persistor: Persistor):
        self.app = app
        self.persistor = persistor
        self.session = session

    async def process_request(
        self, req: SocketRequest
    ) -> Union[SocketResponse, UnknownError]:
        self.app.logger.info("Processing request: %s" % req.json())

        response = None

        if req.v == "room.create":
            self.app.logger.info("Creating room")
            response = await self.create_room(req=req)

        elif req.v == "room.join":
            self.app.logger.info("Joining room")
            response = await self.join_room(req=req)

        elif req.v == "room.leave":
            self.app.logger.info("Leaving room")
            response = await self.leave_room(req=req)

        return response

    async def create_room(self, req: SocketRequest):
        game_room_code = gen_room_code()

        host_player_id = self.session.state.playerId
        if not host_player_id:
            host_player_id = gen_uuid()

        game_class = games_by_name["Catan"]
        game = game_class()

        game_room = PersistedGameRoom(
            game="Catan",
            gameRoomCode=game_room_code,
            gameConfig=game.new_game_config(),
            players=[
                PersistedGamePlayer(playerId=host_player_id, name="", isHost=True)
            ],
        )

        await self.persistor.put_room(room=game_room)

        await self.session.join_room(
            player_id=host_player_id, game_room_code=game_room_code
        )

        return self.sucess_response(
            request=req,
            response_data={
                "gameRoomCode": game_room_code,
                "playerId": host_player_id,
            },
        )

    async def join_room(self, req: SocketRequest):
        payload = JoinRoomPayload.parse_obj(req.d)

        player_id = self.session.state.playerId
        if not player_id:
            player_id = gen_uuid()

        game_room_code = payload.gameRoomCode
        game_room = await self.persistor.get_room(game_room_code=game_room_code)

        # Add the player to the room
        if game_room:
            if not player_in_room(game_room.players, player_id):
                game_room.players.append(
                    PersistedGamePlayer(playerId=player_id, name="", isHost=False)
                )

                await self.persistor.put_room(room=game_room)

            await self.session.join_room(
                player_id=player_id, game_room_code=game_room_code
            )

            return self.sucess_response(
                request=req,
                response_data={
                    "gameRoomCode": game_room_code,
                    "playerId": player_id,
                },
            )
        else:
            raise Exception("Unable to find room")

    async def leave_room(self, req: SocketRequest):
        if self.session.state.gameRoomCode is None:
            return self.sucess_response(req, response_data={})

        player_id = self.session.state.playerId
        game_room_code = self.session.state.gameRoomCode
        game_room = await self.persistor.get_room(game_room_code=game_room_code)

        self.app.logger.info(game_room)

        if game_room:
            # Add the player to the room
            game_room.players = list(
                filter(lambda player: player.playerId != player_id, game_room.players)
            )

            # TODO: Make a new game host
            if len(game_room.players) > 0:
                await self.persistor.put_room(room=game_room)
            else:
                self.app.logger.info(
                    "Last player removed, deleting room " + game_room_code
                )
                await self.persistor.delete_room(game_room_code)

        else:
            raise Exception("Unable to find room")

        await self.session.leave_room(
            player_id=player_id, game_room_code=game_room_code
        )

        return self.sucess_response(
            request=req,
            response_data={},
        )
