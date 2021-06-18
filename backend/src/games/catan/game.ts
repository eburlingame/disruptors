import Game, { GameActionRecord, GamePlayer } from "../model";
import {
  generateStaticLargeBoard,
  generateStaticSmallBoard,
  generateVariableSmallBoard,
} from "./board";
import { sumResources } from "./utils";

import {
  GamePhase,
  CatanAction,
  CatanConfig,
  CatanState,
  CatanPlayersState,
  PlayerTurnState,
  PlayerColor,
  CatanGameSummary,
  RollDiceAction,
  BoardType,
} from "./types";

import actions from "./actions";

import { range, shuffle, sum } from "lodash";
import { randomInt } from "../../util";
import {
  distributeResources,
  getAvailableExchanges,
  playerHasWon,
} from "./board_utils";

export const defaultGameConfig: CatanConfig = {
  cardDiscardLimit: 7,
  boardType: BoardType.VARIABLE,
};

export default class CatanGame
  implements
    Game<
      CatanConfig,
      CatanAction,
      CatanState,
      CatanPlayersState,
      CatanGameSummary
    >
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

    // TODO: Generate big board for >4 players
    const board =
      gameConfig.boardType === BoardType.VARIABLE
        ? generateVariableSmallBoard()
        : generateStaticSmallBoard();

    return {
      board,
      config: gameConfig,
      phase: GamePhase.SETUP_ROUND_1,
      buildings: [],
      roads: [],
      bank: {
        brick: 19,
        wood: 19,
        ore: 19,
        wheat: 19,
        sheep: 19,
        developmentCards: {
          knight: 14,
          victoryPoint: 5,
        },
      },
      players: gamePlayers.map(({ playerId }, index) => ({
        playerId,
        color: Object.values(PlayerColor)[index],
        resources: { brick: 0, wood: 0, ore: 0, wheat: 0, sheep: 0 },
        developmentCards: {
          knight: 0,
          victoryPoint: 0,
        },
        points: {
          public: 0,
          private: 0,
        },
        longestRoad: 1,
        robberDeployCount: 0,
        mustDiscard: 0,
      })),
      robber: null,
      longestRoadOwner: null,
      largestArmyOwner: null,
      activePlayerId: gamePlayers[0].playerId,
      activePlayerTurnState: PlayerTurnState.PLACING_SETTLEMENT,
    };
  }

  prepareAction(
    gameState: CatanState,
    playerId: string,
    action: CatanAction
  ): CatanAction {
    if (action.name === "rollDice") {
      let [diceA, diceB] = [randomInt(6) + 1, randomInt(6) + 1];

      console.log(process.env.NODE_ENV);
      /// In development, use the value passed in from the UI (if provided)
      if (
        process.env.NODE_ENV === "development" &&
        action.values[0] + action.values[1] < 12 &&
        action.values[0] + action.values[1] >= 0
      ) {
        const [a, b] = action.values;

        diceA = a;
        diceB = b;
      }

      const diceTotal = diceA + diceB;

      const distribution = distributeResources(
        gameState.board.tiles,
        gameState.robber,
        gameState.players,
        gameState.buildings,
        diceTotal
      );

      return {
        ...action,
        values: [diceA, diceB],

        /// Cache the distribution amounts in the action so we can display them in the game log
        distribution:
          Object.values(distribution).length > 0 ? distribution : undefined,
      };
    }

    if (action.name === "completeTrade") {
      const { activeTradeRequest } = gameState;

      if (activeTradeRequest && action.completeTrade) {
        return {
          ...action,
          seeking: activeTradeRequest.seeking,
          giving: activeTradeRequest.giving,
        };
      }
    }

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
      availableExchanges: getAvailableExchanges(gameState, playerId),
      players: gameState.players.map((player) => ({
        playerId: player.playerId,
        color: player.color,
        totalResourceCards: sumResources(player),
        totalDevelopmentCards: sum(Object.values(player.developmentCards)),
        points: player.points.public,
        longestRoad: player.longestRoad,
        robberDeployCount: player.robberDeployCount,
      })),
    };
  }

  gameOver(gameState: CatanState): boolean {
    return gameState.players.some((player) => playerHasWon(player));
  }

  gameSummary(
    gameState: CatanState,
    actions: GameActionRecord[]
  ): CatanGameSummary {
    const winner = gameState.players.find((player) => playerHasWon(player));
    if (!winner) throw new Error("Nobody won?");

    const diceFrequencies = actions
      .map((action) => action.action as CatanAction)
      .filter((action) => action.name === "rollDice")
      .map((action) => {
        const diceRollAction = action as RollDiceAction;
        const [a, b] = diceRollAction.values;

        return a + b;
      })
      .reduce(
        (counts, diceValue) => {
          counts[diceValue] += 1;
          return counts;
        },
        range(13).map(() => 0)
      );

    const sortedPlayers = gameState.players.sort(
      (playerA, playerB) =>
        sum(Object.values(playerB.points)) - sum(Object.values(playerA.points))
    );

    return {
      players: sortedPlayers,
      winner: winner.playerId,
      diceFrequencies,
    };
  }
}
