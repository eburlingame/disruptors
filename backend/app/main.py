import os
from fastapi import FastAPI, Depends, Request, WebSocket
from fastapi.responses import HTMLResponse
from aioredis import create_redis_pool, Redis

from app.session import WebsocketSession
from app import config

global_settings = config.Settings()


app = FastAPI()


async def init_redis_pool() -> Redis:
    redis = await create_redis_pool(
        global_settings.redis_url,
        password=global_settings.redis_password,
        encoding="utf-8",
        db=global_settings.redis_db,
    )
    return redis


@app.on_event("startup")
async def startup_event():
    app.state.redis = await init_redis_pool()


@app.on_event("shutdown")
async def shutdown_event():
    app.state.redis.close()
    await app.state.redis.wait_closed()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    session = WebsocketSession(app=app, websocket=websocket)
    session.listen()


@app.get("/health-check")
async def health_check(settings: config.Settings = Depends(config.get_settings)):
    try:
        await app.state.redis.set(str(settings.redis_url), settings.up)
        value = await app.state.redis.get(str(settings.redis_url))
    except:  # noqa: E722
        value = settings.down
    return {settings.web_server: settings.up, str(settings.redis_url): value}
