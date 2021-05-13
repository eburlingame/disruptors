import { atom } from "recoil";

export type GameRoomPlayer = {
  playerId: string;
  isHost: string;
};

export type GameRoom = {
  gameRoomCode: string | null;
  playerId: string | null;
  players: GameRoomPlayer[];
};

export const gameRoomAtom = atom<GameRoom>({
  key: "gameRoom",
  default: {
    gameRoomCode: null,
    playerId: null,
    players: [],
  },
});
