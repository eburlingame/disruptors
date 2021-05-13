import logging
import os
from functools import lru_cache

from pydantic import BaseSettings, AnyUrl


log = logging.getLogger("uvicorn")


class Settings(BaseSettings):
    environment: str = os.getenv("ENVIRONMENT", "dev")
    testing: str = os.getenv("TESTING", "0")
    redis_url: str = os.environ.get("REDIS_HOST", "redis")
    redis_password: str = os.getenv("REDIS_PASSWORD", "redis_pass")
    redis_port: str = os.getenv("REDIS_PORT", 6379)
    redis_db: int = int(os.getenv("REDIS_DB", "0"))
    up: str = os.getenv("UP", "up")
    down: str = os.getenv("DOWN", "down")
    web_server: str = os.getenv("WEB_SERVER", "web_server")


@lru_cache()
def get_settings() -> BaseSettings:
    log.info("Loading config settings from the environment...")
    return Settings()
