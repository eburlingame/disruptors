import { Context } from "src";

export type RoomPlayer = {
  playerId: string;
  name: string;
  isHost: boolean;
};

export type PersistedRoom = {
  roomCode: string;
  players: RoomPlayer[];
  game: string;
  gameConfig: any;
};

const ROOM_PREFIX = "session|";

export default (context: Context) => {
  const { redis } = context;

  const roomKey = (roomCode: string) => ROOM_PREFIX + roomCode;

  const putRoom = async (room: PersistedRoom) => {
    await redis.set(roomKey(room.roomCode), JSON.stringify(room));
  };

  const getRoom = async (roomCode: string): Promise<PersistedRoom | null> => {
    const response = await redis.get(roomKey(roomCode));

    if (response) {
      const room: PersistedRoom = JSON.parse(response);
      return room;
    }

    return null;
  };

  const deleteRoom = async (session: PersistedRoom) => {
    return redis.del(roomKey(session.roomCode));
  };

  return { putRoom, getRoom, deleteRoom };
};
