from pydantic import BaseModel
from typing import Any, Union, Optional, List, Dict


class PersistedPlayer(BaseModel):
    playerId: str
    name: str


class PersistedSession(BaseModel):
    sessionId: str
    playerId: Union[str, None]
    gameRoomId: Union[str, None]


class PersistedGamePlayer(BaseModel):
    playerId: str
    isHost: bool


class PersistedGameRoom(BaseModel):
    playerIds: List[PersistedGamePlayer]
    roomId: str
    gameRoomCode: str
    game: str
    gameConfig: BaseModel


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


class CreateGamePayload(BaseModel):
    gameName: Optional[str]
