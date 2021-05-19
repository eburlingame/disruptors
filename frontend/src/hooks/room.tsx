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

export type GameConfig = {
  cardDiscardLimit: number;
};

export const useConfigureGame = () => {
  const processCommandResponse = useProcessCommandReponse();
  const { sendCommand, loading, error } = useCommand();

  const configureGame = async ({ cardDiscardLimit }: GameConfig) => {
    const result = await sendCommand("game.configure", {
      config: { cardDiscardLimit },
    });

    return processCommandResponse(result);
  };

  return { configureGame, configuring: loading, error };
};

export const useConfigurePlayer = () => {
  const processCommandResponse = useProcessCommandReponse();
  const { sendCommand, loading, error } = useCommand();

  const configurePlayer = async (newName: string) => {
    const result = await sendCommand("player.configure", { name: newName });

    return processCommandResponse(result);
  };

  return { configurePlayer, configuring: loading, error };
};

export const useStartGame = () => {
  const processCommandResponse = useProcessCommandReponse();
  const { sendCommand, loading, error } = useCommand();

  const startGame = async () => {
    const result = await sendCommand("game.start", {});

    return processCommandResponse(result);
  };

  return { startGame, starting: loading, error };
};
