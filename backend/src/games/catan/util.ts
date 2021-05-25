import { CatanPlayer } from "./types";

export const sumResources = (player: CatanPlayer) =>
  Object.values(player.resources).reduce((a, b) => a + b, 0);
