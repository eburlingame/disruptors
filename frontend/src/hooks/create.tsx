import { useRecoilState } from "recoil";
import { gameRoomAtom } from "../state/atoms";
import { useCommand } from "./command";

export const useCreateGame = () => {
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);
  const { sendCommand, loading, error } = useCommand();

  const createGame = async (gameName: string) => {
    const result = await sendCommand("game.create", { gameName });

    if (!result.sucess) return;

    const { gameRoomCode, gameRoomId } = result.data;

    if (gameRoomCode && gameRoomId) {
      setGameRoomState({ gameRoomId, gameRoomCode });
    }

    return { gameRoomCode, gameRoomId };
  };

  return { createGame, creating: loading, error };
};
