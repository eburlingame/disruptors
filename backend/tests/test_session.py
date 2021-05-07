import pytest
from httpx import AsyncClient
import fakeredis.aioredis
from fastapi import status

from app.main import app
from app.session.handler import SessionHandler


@pytest.fixture
async def mock_redis():
    server = fakeredis.FakeServer()
    fake_redis = await fakeredis.aioredis.create_redis_pool(server=server)
    yield fake_redis


@pytest.fixture
async def mock_app(mock_redis):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        app.state.redis = mock_redis
        yield ac


@pytest.fixture
async def session():
    session = SessionHandler(app=app)


@pytest.mark.asyncio
async def test_root(session):
    pass
