from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union

from app.socket.types import *
from app.persistor import Persistor
from app.session import Session

from app.socket.handlers.session_handler import SessionHandler
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
        self.game_handler = GameHandler(app, session, persistor)

    async def listen(self):
        self.app.logger.info("Websocket connection opened")
        # TODO: Listen for game updates
        # pubsub = app.state.redis.pubsub()
        # pubsub.subscript(gameId)

        while True:
            data = await self.websocket.receive_text()
            await self.process_incoming(data)

    async def process_incoming(self, s: str):
        result = await self.process_message(s)

        if isinstance(result, BaseModel):
            self.app.logger.debug("Sending response: " + result.json())
            await self.send_response(result)

    async def process_message(self, msg: str) -> BaseModel:
        try:
            request = self.parse_request(str(msg))
            self.app.logger.info("Recieved request: " + request.json())

            verb_namespace = request.v.split(".")[0]
            self.app.logger.info(verb_namespace)

            # Send the request to the appropriate handler
            response = UnknownError(error="An unknown error occured")

            if verb_namespace == "session":
                response = await self.session_handler.process_request(request)

            elif verb_namespace == "game":
                response = await self.game_handler.process_request(request)

            self.app.logger.info(response)
            return response

        except ValidationError as e:
            self.app.logger.warn("Error parsing given message: " + str(e))
            return UnknownError(error="Error parsing given message: " + str(e)).json()

        # except Exception as e:
        #     self.app.logger.warn("Unknown error occured: " + str(e))
        #     return UnknownError(error="Unknown error occured: " + str(e)).json()

    async def send_response(self, response: SocketResponse):
        await self.websocket.send_text(response.json())

    def parse_request(self, msg: str):
        return SocketRequest.parse_raw(msg)
