from pydantic import BaseModel
from typing import Any, Union, Optional, List, Dict


class PersistedPlayer(BaseModel):
    playerId: str
    name: str


class PersistedSession(BaseModel):
    sessionId: str
    playerId: Union[str, None]
    activeGameId: Union[str, None]


class PersistedGamePlayer(BaseModel):
    playerId: str
    isHost: bool


class PersistedGame(BaseModel):
    gameId: str
    gameCode: str
    playerIds: List[PersistedGamePlayer]
    gameConfig: Dict


class SocketRequest(BaseModel):
    reqId: str
    v: str  # Request verb
    d: Optional[Any]  # Request payload


class SocketResponse(BaseModel):
    reqId: str
    sucess: bool
    v: str
    d: Optional[Any]


class UnknownError(BaseModel):
    sucess: bool = False
    msg: str


class OpenSessionPayload(BaseModel):
    sessionId: Optional[str]


class CreateGamePayload(BaseModel):
    gameName: Optional[str]
