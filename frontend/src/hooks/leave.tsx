import { useRecoilState } from "recoil";
import { gameRoomAtom } from "../state/atoms";
import { useCommand } from "./command";

export const useLeaveRoom = () => {
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);
  const { sendCommand, loading, error } = useCommand();

  const leaveRoom = async () => {
    const result = await sendCommand("room.leave", {});

    if (!result.sucess) return;

    setGameRoomState({
      gameRoomId: null,
      gameRoomCode: null,
      playerId: null,
    });
  };

  return { leaveRoom, leaving: loading, error };
};
