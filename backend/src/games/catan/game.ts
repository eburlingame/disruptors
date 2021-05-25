import Game, { GamePlayer } from "../model";
import { generateStaticBoard } from "./board";
import { sumResources } from "./util";
import {
  GamePhase,
  CatanAction,
  CatanConfig,
  CatanState,
  CatanPlayersState,
} from "./types";
import { shuffle } from "lodash";

export const defaultGameConfig: CatanConfig = {
  cardDiscardLimit: 7,
};

export default class CatanGame
  implements Game<CatanConfig, CatanAction, CatanState, CatanPlayersState>
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
      players: shuffle(players).map(({ playerId }) => ({
        playerId,
        resources: { brick: 0, wood: 0, ore: 0, wheat: 0, sheep: 0 },
        developmentCards: [],
      })),
    };
  }

  prepareAction(
    gameState: CatanState,
    playerId: string,
    action: CatanAction
  ): CatanAction {
    return action;
  }

  applyAction(
    gameState: CatanState,
    playerId: string,
    action: CatanAction
  ): CatanState {
    return gameState;
  }

  sanitizeState(gameState: CatanState, playerId: string): CatanPlayersState {
    const you = gameState.players.find(
      (player) => player.playerId === playerId
    );

    if (!you) throw new Error("Invalid player");

    return {
      ...gameState,
      you,
      players: gameState.players.map((player) => ({
        playerId,
        totalResourceCards: sumResources(player),
        totalDevelopmentCards: player.developmentCards.length,
        points: 0,
      })),
    };
  }
}
