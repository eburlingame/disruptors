from pydantic import BaseModel
from typing import Any, Union, Optional, List, Dict


class PersistedSession(BaseModel):
    sessionId: str
    gameRoomCode: Union[str, None]
    playerId: Union[str, None]


class PersistedGamePlayer(BaseModel):
    playerId: str
    name: str
    isHost: bool


class PersistedGameRoom(BaseModel):
    gameRoomCode: str
    game: str
    gameConfig: BaseModel
    players: List[PersistedGamePlayer]


class PersistedGame(BaseModel):
    gameId: str
    gameRoomId: str
    gameState: BaseModel


class SocketRequest(BaseModel):
    reqId: str
    v: str  # Request verb
    d: Optional[Any]  # Request payload


class SocketResponse(BaseModel):
    sucess: bool = True
    reqId: str
    v: str
    d: Optional[Any]


class SocketUpdate(BaseModel):
    v: str
    d: Optional[Any]


class SocketErrorResponse(BaseModel):
    sucess: bool = False
    error: str
    reqId: str
    v: str


class UnknownError(BaseModel):
    sucess: bool = False
    error: str


class OpenSessionPayload(BaseModel):
    sessionId: Optional[str]
