from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import Any, Union

from app.socket.types import *
from app.persistor import Persistor

from app.socket.handlers.session_handler import SessionHandler
from app.socket.handlers.game_handler import GameHandler

from pydantic.error_wrappers import ValidationError


class WebsocketSession:
    def __init__(self, app: FastAPI, websocket: WebSocket, persistor: Persistor):
        self.app = app
        self.websocket = websocket
        self.persistor = persistor

        self.session_handler = SessionHandler(app, persistor)
        self.game_handler = GameHandler(app, persistor)

    async def listen(self):
        self.app.logger.info("Websocket connection opened")
        # TODO: Listen for game updates
        # pubsub = app.state.redis.pubsub()
        # pubsub.subscript(gameId)

        while True:
            data = await self.websocket.receive_text()
            await self.process_incoming(data)

    async def send_response(self, response: SocketResponse):
        await self.websocket.send_text(response.json())

    async def process_incoming(self, s: str):
        result = await self.process_message(s)

        if isinstance(result, BaseModel):
            self.app.logger.debug("Sending response: " + result.json())
            await self.send_response(result)

    def parse_request(self, msg: str):
        return SocketRequest.parse_raw(msg)

    async def process_message(self, msg: str) -> Union[SocketResponse, UnknownError]:
        try:
            request = self.parse_request(str(msg))
            self.app.logger.info("Recieved request: " + request.json())

            verb_namespace = request.v.split(".")[0]
            self.app.logger.info(verb_namespace)

            response = UnknownError(msg="An unknown error occured")
            if verb_namespace == "session":
                response = await self.session_handler.process_request(request)

            elif verb_namespace == "game":
                pass

            return response

        except ValidationError as e:
            self.app.logger.warn("Error paring given message: " + str(e))
            return UnknownError(msg="Error paring given message: " + str(e)).json()

        except Exception as e:
            self.app.logger.warn("Unknown error occured: " + str(e))
            return UnknownError(msg="Unknown error occured: " + str(e)).json()
