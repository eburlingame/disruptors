from fastapi import FastAPI
from aioredis import Redis
from pydantic import BaseModel
from typing import Any, Union

from app.socket.types import *


class Persistor:
    async def get_session(self, session_id: str):
        raise Exception("Unimplemented")

    async def put_session(self, session: PersistedSession):
        raise Exception("Unimplemented")


class RedisPersistor(Persistor):
    def __init__(self, app: FastAPI, redis: Redis):
        self.app = app
        self.redis = redis

    def format_session_key(self, session_id: str):
        return "session|" + session_id

    async def get_session(self, session_id: str):
        record_text = await self.redis.get(self.format_session_key(session_id))

        if record_text is not None:
            return PersistedSession.parse_raw(record_text)

        return False

    async def put_session(self, session: PersistedSession):
        record_text = session.json()
        await self.redis.set(self.format_session_key(session.sessionId), record_text)

    def format_room_key(self, game_room_code: str):
        return "room|" + game_room_code

    async def get_room(self, game_room_code: str):
        record_text = await self.redis.get(self.format_room_key(game_room_code))

        if record_text is not None:
            return PersistedGameRoom.parse_raw(record_text)

        return False

    async def put_room(self, room: PersistedGameRoom):
        record_text = room.json()
        await self.redis.set(self.format_room_key(room.gameRoomCode), record_text)

    async def delete_room(self, game_room_code: str):
        await self.redis.delete(self.format_room_key(game_room_code))
