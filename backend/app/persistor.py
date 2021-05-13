from fastapi import FastAPI
from redis import Redis
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
        self.pubsub = self.redis.pubsub()

    def format_session_key(self, session_id: str):
        return "session|" + session_id

    async def get_session(self, session_id: str):
        record_text = self.redis.get(self.format_session_key(session_id))

        if record_text is not None:
            return PersistedSession.parse_raw(record_text)

        return False

    async def put_session(self, session: PersistedSession):
        record_text = session.json()
        self.redis.set(self.format_session_key(session.sessionId), record_text)

    def format_room_key(self, game_room_code: str):
        return "room|" + game_room_code

    async def get_room(self, game_room_code: str):
        record_text = self.redis.get(self.format_room_key(game_room_code))

        if record_text is not None:
            return PersistedGameRoom.parse_raw(record_text)

        return False

    async def put_room(self, room: PersistedGameRoom):
        record_text = room.json()
        room_key = self.format_room_key(room.gameRoomCode)

        self.redis.set(room_key, record_text)
        self.redis.publish(room_key, record_text)

    async def delete_room(self, game_room_code: str):
        self.redis.delete(self.format_room_key(game_room_code))

    async def subscribe_to_room(self, game_room_code: str):
        self.redis.subscribe(self.format_room_key(game_room_code))
