import { useCommand, useProcessCommandReponse } from "./command";

export const useGameAction = () => {
  const processCommandResponse = useProcessCommandReponse();
  const { sendCommand, loading, error } = useCommand();

  const performAction = async (action: object) => {
    let t0 = performance.now();
    const result = await sendCommand("game.action", { action });
    let t1 = performance.now();

    console.log("Request took " + (t1 - t0) + " ms");

    t0 = performance.now();
    await processCommandResponse(result);
    t1 = performance.now();
    
    console.log("Command took " + (t1 - t0) + " ms");
  };

  return { performAction, loading: loading, error };
};
