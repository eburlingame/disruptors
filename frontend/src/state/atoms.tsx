import { atom } from "recoil";

export type GameRoom = {
  gameRoomCode: string | null;
  gameRoomId: string | null;
};

export const gameRoomAtom = atom<GameRoom>({
  key: "gameRoom",
  default: {
    gameRoomCode: null,
    gameRoomId: null,
  },
});
