"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.defaultGameConfig = void 0;
var board_1 = require("./board");
var util_1 = require("./util");
var types_1 = require("./types");
var actions_1 = require("./actions");
var lodash_1 = require("lodash");
var util_2 = require("src/util");
exports.defaultGameConfig = {
    cardDiscardLimit: 7
};
var CatanGame = /** @class */ (function () {
    function CatanGame() {
    }
    CatanGame.prototype.newGameConfig = function () {
        return exports.defaultGameConfig;
    };
    CatanGame.prototype.updateGameConfig = function (players, newGameConfig) {
        // Do validation of the new game config here
        return newGameConfig;
    };
    CatanGame.prototype.readyToStart = function (players, gameConfig) {
        return true;
    };
    CatanGame.prototype.startGame = function (players, gameConfig) {
        var gamePlayers = lodash_1.shuffle(players);
        return {
            config: gameConfig,
            phase: types_1.GamePhase.SETUP_ROUND_1,
            board: board_1.generateStaticBoard(),
            buildings: [],
            roads: [],
            bank: {
                brick: 19,
                wood: 19,
                ore: 19,
                wheat: 19,
                sheep: 19,
                developmentCards: []
            },
            players: gamePlayers.map(function (_a, index) {
                var playerId = _a.playerId;
                return ({
                    playerId: playerId,
                    color: Object.values(types_1.PlayerColor)[index],
                    resources: { brick: 0, wood: 0, ore: 0, wheat: 0, sheep: 0 },
                    developmentCards: []
                });
            }),
            activePlayerId: gamePlayers[0].playerId,
            activePlayerTurnState: types_1.PlayerTurnState.PLACING_SETTLEMENT
        };
    };
    CatanGame.prototype.prepareAction = function (gameState, playerId, action) {
        if (action.name === "rollDice") {
            return __assign(__assign({}, action), { values: [util_2.randomInt(6), util_2.randomInt(6)] });
        }
        return action;
    };
    CatanGame.prototype.applyAction = function (gameState, playerId, action) {
        var actionHandler = actions_1["default"][action.name];
        if (actionHandler) {
            return actionHandler(gameState, playerId, action);
        }
        throw new Error("Invalid action " + action.name);
    };
    CatanGame.prototype.sanitizeState = function (gameState, playerId) {
        var you = gameState.players.find(function (player) { return player.playerId === playerId; });
        if (!you)
            throw new Error("Invalid player");
        return __assign(__assign({}, gameState), { you: you, players: gameState.players.map(function (player) { return ({
                playerId: player.playerId,
                color: player.color,
                totalResourceCards: util_1.sumResources(player),
                totalDevelopmentCards: player.developmentCards.length,
                points: 0
            }); }) });
    };
    return CatanGame;
}());
exports["default"] = CatanGame;
