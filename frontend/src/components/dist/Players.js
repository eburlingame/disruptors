"use strict";
exports.__esModule = true;
var react_1 = require("react");
var layout_1 = require("@chakra-ui/layout");
var GameView_1 = require("./GameView");
var session_1 = require("../hooks/session");
var fa_1 = require("react-icons/fa");
var CardCount_1 = require("./CardCount");
var color_mode_1 = require("@chakra-ui/color-mode");
var Players = function (_a) {
    var room = session_1.useSessionState().room;
    var gameState = GameView_1.useGameViewState().gameState;
    var activeColor = color_mode_1.useColorModeValue("blue.400", "blue.800");
    if (!room) {
        return react_1["default"].createElement(layout_1.Box, null, "Invalid players");
    }
    var roomPlayers = room.players;
    /// Combine the room players with the game players
    var players = gameState.state.players.map(function (gamePlayer) { return ({
        roomPlayer: roomPlayers.find(function (roomPlayer) { return gamePlayer.playerId === roomPlayer.playerId; }),
        gamePlayer: gamePlayer
    }); });
    return (react_1["default"].createElement(layout_1.VStack, { alignItems: "stretch", overflowY: "scroll" }, players.map(function (_a) {
        var roomPlayer = _a.roomPlayer, _b = _a.gamePlayer, playerId = _b.playerId, totalResourceCards = _b.totalResourceCards, totalDevelopmentCards = _b.totalDevelopmentCards;
        return (react_1["default"].createElement(layout_1.HStack, { borderStyle: "solid", rounded: "md", p: "2", justifyContent: "space-between", borderColor: gameState.state.activePlayerId === playerId
                ? activeColor
                : "inherit", borderWidth: gameState.state.activePlayerId === playerId ? "2px" : "0.5px" },
            react_1["default"].createElement(layout_1.HStack, { marginLeft: "2" },
                react_1["default"].createElement(fa_1.FaUser, null),
                react_1["default"].createElement(layout_1.Box, { fontWeight: "700" }, roomPlayer === null || roomPlayer === void 0 ? void 0 : roomPlayer.name)),
            react_1["default"].createElement(layout_1.HStack, null,
                react_1["default"].createElement(CardCount_1["default"], { icon: react_1["default"].createElement(fa_1.FaIdCard, null), label: "Resource cards", count: totalResourceCards }),
                react_1["default"].createElement(CardCount_1["default"], { icon: react_1["default"].createElement(fa_1.FaQuestionCircle, null), label: "Development cards", count: totalDevelopmentCards }))));
    })));
};
exports["default"] = Players;
