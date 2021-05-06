import pytest
from httpx import AsyncClient
import fakeredis.aioredis
from fastapi import status

from app.catan.setup import fixedBoard


def test_setup():
    board = fixedBoard()
    assert board.tiles[0].diceNumber == 10
    assert len(board.tiles) == 19
    
    # Ensure the coordinates are valid
    for tile in board.tiles:
        assert tile.location.x + tile.location.y + tile.location.z == 0

