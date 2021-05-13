from typing import Union
from app.socket.types import *


class BaseHandler:
    def sucess_response(self, request: SocketRequest, response_data):
        return SocketResponse(
            reqId=request.reqId, sucess=True, v=request.v, d=response_data
        )

    async def check_for_updates(self) -> Union[BaseModel, None]:
        return None

    async def process_request(self, req: SocketRequest) -> BaseModel:
        raise Exception("Unimplemented")
