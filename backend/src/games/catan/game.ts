import Game, { GamePlayer } from "../model";
import { generateStaticBoard } from "./board";
import { GamePhase, CatanAction, CatanConfig, CatanState } from "./types";

export const defaultGameConfig: CatanConfig = {
  cardDiscardLimit: 7,
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
      board: generateStaticBoard(),
      bank: {
        brick: 19,
        wood: 19,
        ore: 19,
        wheat: 19,
        sheep: 19,
        developmentCards: [],
      },
      players: players.map(({ playerId }) => ({
        playerId,
        resources: { brick: 0, wood: 0, ore: 0, wheat: 0, sheep: 0 },
        developmentCards: [],
      })),
    };
  }

  applyAction(gameState: CatanState, action: CatanAction): CatanState {
    return gameState;
  }
}
