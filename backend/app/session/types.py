from pydantic import BaseModel
from typing import Any, Optional


class SocketRequest(BaseModel):
    reqId: str
    v: str
    d: Optional[Any]


class SocketResponse(BaseModel):
    reqId: str
    sucess: bool
    v: str
    d: Optional[Any]


class UnknownError(BaseModel):
    sucess: bool = False
    msg: str
