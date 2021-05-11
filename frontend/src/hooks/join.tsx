import { useRecoilState } from "recoil";
import { gameRoomAtom } from "../state/atoms";
import { useCommand } from "./command";

export const useJoinRoom = () => {
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);
  const { sendCommand, loading, error } = useCommand();

  const joinRoom = async (roomCode: string) => {
    const result = await sendCommand("game.join", { roomCode });

    if (!result.sucess) return;

    const { gameRoomCode, gameRoomId } = result.data;

    if (gameRoomCode && gameRoomId) {
      setGameRoomState({ gameRoomId, gameRoomCode });
    }

    return { gameRoomCode, gameRoomId };
  };

  return { joinRoom, joining: loading, error };
};
