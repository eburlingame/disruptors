from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union
from app.session.types import *
from aioredis import Redis


class SessionHandler:
    def __init__(self, app: FastAPI):
        self.app = app
        self.redis = app.state.redis

    def sucess_response(self, request: SocketRequest, response_data):
        return SocketResponse(
            reqId=request.reqId, sucess=True, v=request.v, d=response_data
        )

    async def process_request(
        self, req: SocketRequest
    ) -> Union[SocketResponse, UnknownError]:
        self.app.logger.info("Processing request: %s" % req.json())
        return self.sucess_response(request=req, response_data={"test": "test"})

    