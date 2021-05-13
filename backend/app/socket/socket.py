import asyncio
from asyncio.exceptions import CancelledError
from asyncio.tasks import FIRST_COMPLETED
from app.socket.base_handler import BaseHandler
from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocketDisconnect
from pydantic import BaseModel
from typing import Any, Union

from app.socket.types import *
from app.persistor import Persistor
from app.session import Session

from app.socket.handlers.session_handler import SessionHandler
from app.socket.handlers.room_handler import RoomHandler
from app.socket.handlers.game_handler import GameHandler

from pydantic.error_wrappers import ValidationError


class SocketHandler:
    def __init__(
        self, app: FastAPI, websocket: WebSocket, session: Session, persistor: Persistor
    ):
        self.app = app
        self.websocket = websocket
        self.session = session
        self.persistor = persistor

        self.session_handler = SessionHandler(app, session, persistor)
        self.room_handler = RoomHandler(app, session, persistor)
        self.game_handler = GameHandler(app, session, persistor)

    async def listen(self):
        self.app.logger.info("Websocket connection opened")

        socket_task = asyncio.create_task(self.listen_to_socket())
        handler_task = asyncio.create_task(self.listen_to_handlers())

        # Kick off both tasks, and continue once the websocket task has completed
        await asyncio.wait(
            {socket_task, handler_task},
            return_when=FIRST_COMPLETED,
        )

        handler_task.cancel()
        self.app.logger.info("Socket listening tasks stopped")

    async def listen_to_socket(self):
        # Wait for messages until the websocket connection is closed
        while True:
            try:
                data = await self.websocket.receive_text()
                await self.process_incoming(data)

            except WebSocketDisconnect as e:
                self.app.logger.info("Websocket connection closed: {0}".format(e))
                return True

    async def listen_to_handlers(self):
        while True:
            try:
                # Call update on the handlers so they can process pubsub messages
                await self.process_outgoing(self.session_handler)
                await self.process_outgoing(self.room_handler)
                await self.process_outgoing(self.game_handler)

                await asyncio.sleep(0.1)

            except CancelledError:
                return True

    async def process_incoming(self, s: str):
        result = await self.process_message(s)

        if result is not None and isinstance(result, BaseModel):
            self.app.logger.info("Sending response: " + result.json())
            await self.send_response(result)

    async def process_message(self, msg: str) -> BaseModel:
        try:
            request = self.parse_request(str(msg))
            try:
                response = await self.call_handler(request=request)
                return response

            except Exception as e:
                return SocketErrorResponse(
                    reqId=request.reqId, v=request.v, error=str(e)
                )

        except ValidationError as e:
            self.app.logger.warn("Error parsing given message: " + str(e))
            return UnknownError(error="Error parsing given message: " + str(e)).json()

        except Exception as e:
            self.app.logger.warn("Unknown error occured: " + str(e))
            return UnknownError(error="Unknown error occured: " + str(e)).json()

    async def call_handler(self, request: SocketRequest):
        # Send the request to the appropriate handler
        response = UnknownError(error="An unknown error occured")

        verb_namespace = request.v.split(".")[0]

        if verb_namespace == "session":
            response = await self.session_handler.process_request(request)

        elif verb_namespace == "room":
            response = await self.room_handler.process_request(request)

        elif verb_namespace == "game":
            response = await self.game_handler.process_request(request)

        return response

    async def process_outgoing(self, handler: BaseHandler):
        result = await handler.check_for_updates()

        if result is not None and isinstance(result, BaseModel):
            self.app.logger.info("Sending adhoc: " + result.json())
            await self.send_response(result)

    async def send_response(self, response: SocketResponse):
        await self.websocket.send_text(response.json())

    def parse_request(self, msg: str):
        return SocketRequest.parse_raw(msg)
