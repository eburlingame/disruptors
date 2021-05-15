import { useCommand, useProcessCommandReponse } from "./command";

export const useCreateGame = () => {
  const processCommandResponse = useProcessCommandReponse();
  const { sendCommand, loading, error } = useCommand();

  const createGame = async (roomName: string) => {
    const result = await sendCommand("room.create", { roomName });

    return processCommandResponse(result);
  };

  return { createGame, creating: loading, error };
};

export const useJoinRoom = () => {
  const processCommandResponse = useProcessCommandReponse();
  const { sendCommand, loading, error } = useCommand();

  const joinRoom = async (roomCode: string) => {
    const result = await sendCommand("room.join", { roomCode });

    return processCommandResponse(result);
  };

  return { joinRoom, joining: loading, error };
};

export const useLeaveRoom = () => {
  const processCommandResponse = useProcessCommandReponse();
  const { sendCommand, loading, error } = useCommand();

  const leaveRoom = async () => {
    const result = await sendCommand("room.leave", {});

    return processCommandResponse(result);
  };

  return { leaveRoom, leaving: loading, error };
};
