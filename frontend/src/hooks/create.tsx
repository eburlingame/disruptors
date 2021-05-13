import { useRecoilState } from "recoil";
import { gameRoomAtom } from "../state/atoms";
import { useCommand } from "./command";

export const useCreateGame = () => {
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);
  const { sendCommand, loading, error } = useCommand();

  const createGame = async (gameName: string) => {
    const result = await sendCommand("room.create", { gameName });

    if (!result.sucess) return;

    const { gameRoomCode, playerId, players } = result.data;

    if (gameRoomCode && playerId && players) {
      setGameRoomState({ gameRoomCode, playerId, players });
    }

    return { gameRoomCode, playerId };
  };

  return { createGame, creating: loading, error };
};
