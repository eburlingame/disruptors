import { useRecoilState } from "recoil";
import { gameRoomAtom } from "../state/atoms";
import { useCommand } from "./command";

export const useJoinRoom = () => {
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);
  const { sendCommand, loading, error } = useCommand();

  const joinRoom = async (roomCode: string) => {
    const result = await sendCommand("room.join", { gameRoomCode: roomCode });

    if (!result.sucess) return;

    const { gameRoomCode, playerId } = result.data;

    if (gameRoomCode && playerId) {
      setGameRoomState({ gameRoomCode, playerId });
    }

    return { gameRoomCode };
  };

  return { joinRoom, joining: loading, error };
};
