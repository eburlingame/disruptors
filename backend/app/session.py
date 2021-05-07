import uuid
from fastapi import FastAPI, WebSocket

def gen_uuid():
    return str(uuid.uuid4())

class WebsocketSession:
    
    def __init__(self, app: FastAPI, websocket: WebSocket):
        self.app = app
        self.websocket = websocket

    async def listen(self):

        # TODO: Listen for game updates
        # pubsub = app.state.redis.pubsub()
        # pubsub.subscript(gameId)

        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Hello from server: {data}")
