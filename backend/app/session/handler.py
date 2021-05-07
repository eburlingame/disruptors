from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union
from app.session.types import *
from aioredis import Redis


class SessionHandler:
    def __init__(self, app: FastAPI):
        self.app = app
        self.redis = app.state.redis

    async def process_request(self, req: SocketRequest) -> Union[SocketResponse, UnknownError]:
        self.app.logger.info("Processing request: %s" % req.json())
        return SocketResponse(reqId=req.reqId, sucess=True, v=req.v)
