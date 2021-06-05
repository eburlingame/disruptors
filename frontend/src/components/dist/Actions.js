"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var layout_1 = require("@chakra-ui/layout");
var game_theme_1 = require("../utils/game_theme");
var game_types_1 = require("../state/game_types");
var GameView_1 = require("./GameView");
var button_1 = require("@chakra-ui/button");
var fa_1 = require("react-icons/fa");
var game_1 = require("../hooks/game");
var canBuildRoad = function (state) {
    return state.you.resources.brick >= 1 && state.you.resources.wood >= 1;
};
var canBuildSettlement = function (state) {
    return state.you.resources.brick >= 1 &&
        state.you.resources.wood >= 1 &&
        state.you.resources.sheep >= 1 &&
        state.you.resources.wheat >= 1;
};
var canBuildCity = function (state) {
    return state.you.resources.ore >= 3 && state.you.resources.wheat >= 2;
};
var canBuyDevelopmentCard = function (state) {
    return state.you.resources.ore >= 1 &&
        state.you.resources.sheep >= 1 &&
        state.you.resources.wheat >= 1;
};
var Actions = function (_a) {
    var state = GameView_1.useGameViewState().gameState.state;
    var performAction = game_1.useGameAction().performAction;
    var yourTurn = state.activePlayerId === state.you.playerId;
    var mustRoll = yourTurn && state.activePlayerTurnState === game_types_1.PlayerTurnState.MUST_ROLL;
    var isIdle = yourTurn && state.activePlayerTurnState === game_types_1.PlayerTurnState.IDLE;
    var onDiceRoll = function () { return __awaiter(void 0, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mustRoll) return [3 /*break*/, 2];
                    action = { name: "rollDice", values: [-1, -1] };
                    return [4 /*yield*/, performAction(action)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var onEndTurn = function () { return __awaiter(void 0, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(isIdle && !mustRoll)) return [3 /*break*/, 2];
                    action = { name: "endTurn" };
                    return [4 /*yield*/, performAction(action)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var onChangeTurnAction = function (turnAction) { return function () { return __awaiter(void 0, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isIdle) return [3 /*break*/, 2];
                    action = { name: "changeTurnAction", turnAction: turnAction };
                    return [4 /*yield*/, performAction(action)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }; };
    if (!yourTurn) {
        return react_1["default"].createElement(react_1["default"].Fragment, null);
    }
    return (react_1["default"].createElement(layout_1.VStack, { alignItems: "stretch" },
        react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(fa_1.FaDice, null), justifyContent: "left", colorScheme: "purple", onClick: onDiceRoll, disabled: !mustRoll }, "Roll the dice"),
        react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(fa_1.FaExchangeAlt, null), justifyContent: "left", colorScheme: "yellow", disabled: !isIdle }, "Trade with others"),
        react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(fa_1.FaUniversity, null), justifyContent: "left", colorScheme: "yellow", disabled: !isIdle }, "Trade with the bank"),
        react_1["default"].createElement(layout_1.HStack, null,
            react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(fa_1.FaMagic, null), justifyContent: "left", flex: "1", colorScheme: "orange", disabled: !isIdle || !(state.you.developmentCards.length > 0) }, "Play dev card"),
            react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(fa_1.FaDollarSign, null), justifyContent: "left", flex: "1", colorScheme: "orange", disabled: !isIdle || !canBuyDevelopmentCard(state) }, "Buy dev card")),
        react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(game_theme_1["default"].buildings.road.icon, null), justifyContent: "left", colorScheme: "green", disabled: !isIdle || !canBuildRoad(state), onClick: onChangeTurnAction("buildRoad") },
            "Build ",
            game_theme_1["default"].buildings.road.name),
        react_1["default"].createElement(layout_1.HStack, null,
            react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(game_theme_1["default"].buildings.settlement.icon, null), justifyContent: "left", flex: "1", colorScheme: "green", disabled: !isIdle || !canBuildSettlement(state), onClick: onChangeTurnAction("buildSettlement") },
                "Build ",
                game_theme_1["default"].buildings.settlement.name),
            react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(game_theme_1["default"].buildings.city.icon, null), justifyContent: "left", flex: "1", colorScheme: "green", disabled: !isIdle || !canBuildCity(state), onClick: onChangeTurnAction("buildCity") },
                "Build ",
                game_theme_1["default"].buildings.city.name)),
        react_1["default"].createElement(button_1.Button, { leftIcon: react_1["default"].createElement(fa_1.FaStopCircle, null), justifyContent: "left", colorScheme: "red", disabled: !isIdle || mustRoll, onClick: onEndTurn }, "End turn")));
};
exports["default"] = Actions;
