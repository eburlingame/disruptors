import { useRecoilState } from "recoil";
import { gameRoomAtom } from "../state/atoms";
import { useCommand } from "./command";

export const useCreateGame = () => {
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);
  const { sendCommand, loading, error } = useCommand();

  const createGame = async (gameName: string) => {
    const result = await sendCommand("room.create", { gameName });

    if (!result.sucess) return;

    const { gameRoomCode, playerId } = result.data;

    if (gameRoomCode && playerId) {
      setGameRoomState({ gameRoomCode, playerId });
    }

    return { gameRoomCode, playerId };
  };

  return { createGame, creating: loading, error };
};
