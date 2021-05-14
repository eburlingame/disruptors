import { atom } from "recoil";

/// Theses should match the types from handler.ts on the server
export type RoomPlayer = {
  playerId: string;
  name: string;
  isHost: boolean;
};

export type Room = {
  roomCode: string;
  players: RoomPlayer[];
  game: string;
  gameConfig: any;
};

export type SessionState = {
  sessionId: string;
  you?: RoomPlayer;
  room?: Room;
  game?: {
    state: any;
  };
};

export const sessionStateAtom = atom<SessionState>({
  key: "sessionState",
  default: {
    sessionId: "",
  },
});

export type SessionLoadingState = {
  isOpen: boolean;
  isLoading: boolean;
};

export const sessionLoadingStateAtom = atom<SessionLoadingState>({
  key: "sessionLoadingState",
  default: {
    isOpen: false,
    isLoading: true,
  },
});
