import Game, { GamePlayer } from "../model";

export enum GamePhase {
  SETUP_ROUND_1 = "setup1",
  SETUP_ROUND_2 = "setup2",
  PLAYER = "playing",
  ROBBER_ROLLER = "robber_rolled",
}

export type CatanAction = {};

export type CatanConfig = {
  cardDiscardLimit: number;
};

export const defaultGameConfig: CatanConfig = {
  cardDiscardLimit: 7,
};

export type CatanState = {
  config: CatanConfig;
  phase: GamePhase;
};

export default class CatanGame
  implements Game<CatanConfig, CatanState, CatanAction>
{
  constructor() {}

  newGameConfig(): CatanConfig {
    return defaultGameConfig;
  }

  updateGameConfig(
    players: GamePlayer[],
    newGameConfig: CatanConfig
  ): CatanConfig {
    // Do validation of the new game config here
    return newGameConfig;
  }

  readyToStart(players: GamePlayer[], gameConfig: CatanConfig): boolean {
    return true;
  }

  startGame(players: GamePlayer[], gameConfig: CatanConfig): CatanState {
    return {
      config: gameConfig,
      phase: GamePhase.SETUP_ROUND_1,
    };
  }

  applyAction(gameState: CatanState, action: CatanAction): CatanState {
    return gameState;
  }
}
