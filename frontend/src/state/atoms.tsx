import { atom } from "recoil";

/// Theses should match the types from room.ts on the server
export type RoomPlayer = {
  playerId: string;
  name: string;
  isHost: boolean;
};

export type GameState = {
  state: any;
  actions: any[];
};

export enum RoomPhase {
  OPENED = 0,
  PLAYING = 1,
  GAME_COMPLETE = 2,
}

export type Room = {
  roomCode: string;
  players: RoomPlayer[];
  phase: RoomPhase;

  game: string;
  gameConfig: any;
  gameReady: boolean;
  gameState?: GameState;
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
