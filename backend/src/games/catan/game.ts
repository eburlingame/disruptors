import Game, { GamePlayer } from "../model";
import { generateStaticBoard } from "./board";
import { sumResources } from "./util";

import {
  GamePhase,
  CatanAction,
  CatanConfig,
  CatanState,
  CatanPlayersState,
  PlayerTurnState,
  PlayerColor,
} from "./types";

import actions from "./actions";

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
    const gamePlayers = shuffle(players);

    return {
      config: gameConfig,
      phase: GamePhase.SETUP_ROUND_1,
      board: generateStaticBoard(),
      buildings: [],
      roads: [],
      bank: {
        brick: 19,
        wood: 19,
        ore: 19,
        wheat: 19,
        sheep: 19,
        developmentCards: [],
      },
      players: gamePlayers.map(({ playerId }, index) => ({
        playerId,
        color: Object.values(PlayerColor)[index],
        resources: { brick: 0, wood: 0, ore: 0, wheat: 0, sheep: 0 },
        developmentCards: [],
      })),
      activePlayerId: gamePlayers[0].playerId,
      activePlayerTurnState: PlayerTurnState.PLACING_SETTLEMENT,
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
    const actionHandler = actions[action.name];

    if (actionHandler) {
      return actionHandler(gameState, playerId, action);
    }

    throw new Error(`Invalid action ${action.name}`);
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
        playerId: player.playerId,
        color: player.color,
        totalResourceCards: sumResources(player),
        totalDevelopmentCards: player.developmentCards.length,
        points: 0,
      })),
    };
  }
}
