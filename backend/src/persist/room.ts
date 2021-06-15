import { Context } from "src";
import { PubSubCallback } from "src/pubsub";

export type RoomPlayer = {
  playerId: string;
  name: string;
  isHost: boolean;
};

export type GameActionRecord = {
  id: string;
  at: number; // date
  who: string; /// playerId
  action: any;
};

export type PersistedGameState = {
  state: any;
  actions: GameActionRecord[];
};

export enum RoomPhase {
  OPENED = 0,
  PLAYING = 1,
  GAME_COMPLETE = 2,
}

export type PersistedRoom = {
  roomCode: string;
  players: RoomPlayer[];
  phase: RoomPhase;

  game: string;
  gameConfig: any;
  gameReady: boolean;
  gameState?: PersistedGameState;
};

const ROOM_PREFIX = "room|";

export default (context: Context) => {
  const { redis, pubsub } = context;

  const roomKey = (roomCode: string) => ROOM_PREFIX + roomCode;

  const putRoom = async (room: PersistedRoom) => {
    const key = roomKey(room.roomCode);

    await redis.set(key, JSON.stringify(room));
    await redis.publish(key, JSON.stringify(room));
  };

  const getRoom = async (roomCode: string): Promise<PersistedRoom | null> => {
    const response = await redis.get(roomKey(roomCode));

    if (response) {
      const room: PersistedRoom = JSON.parse(response);
      return room;
    }

    return null;
  };

  const deleteRoom = async (room: PersistedRoom) => {
    return redis.del(roomKey(room.roomCode));
  };

  const subscribeToRoom = (
    roomCode: string,
    sessionId: string,
    cb: PubSubCallback
  ): Promise<boolean> => {
    return pubsub.subscribe(roomKey(roomCode), sessionId, cb);
  };

  const unsubscribeFromRoom = (
    roomCode: string,
    sessionId: string
  ): Promise<boolean> => {
    return pubsub.unsubscribe(roomKey(roomCode), sessionId);
  };

  return { putRoom, getRoom, deleteRoom, subscribeToRoom, unsubscribeFromRoom };
};
