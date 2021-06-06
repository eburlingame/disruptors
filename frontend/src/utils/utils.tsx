import { Room, RoomPlayer } from "../state/atoms";

export const range = (to: number, step: number = 1) => {
  if ((to < 0 && step > 0) || (to > 0 && step < 0))
    throw Error("to must be positive");

  let arr = [];
  for (let i = 0; i < to; i++) {
    arr.push(i);
  }

  return arr;
};

export const getRoomPlayer = (
  room: Room | undefined,
  playerId: string
): RoomPlayer => {
  if (!room) {
    throw new Error("Room was undefined!");
  }

  const player = room.players.find(
    (roomPlayer) => roomPlayer.playerId === playerId
  );

  if (!player) {
    throw new Error(`Unable to find player with playerId ${playerId}`);
  }

  return player;
};
