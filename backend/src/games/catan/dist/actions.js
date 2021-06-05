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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var board_utils_1 = require("./board_utils");
var types_1 = require("./types");
var isVertexEmpty = function (state, location) {
    location = board_utils_1.getCommonVertexCoordinate(state.board.tiles, location);
    return (state.buildings.find(function (building) {
        return board_utils_1.vertexCoordinateEqual(location, building.location);
    }) === undefined);
};
var isEdgeEmpty = function (state, location) {
    location = board_utils_1.getCommonEdgeCoordinate(state.board.tiles, location);
    return (state.roads.find(function (road) { return board_utils_1.edgeCoordinateEqual(location, road.location); }) ===
        undefined);
};
var previousPlayer = function (state) {
    var currentPlayerIndex = state.players.findIndex(function (player) { return player.playerId === state.activePlayerId; });
    var newIndex = currentPlayerIndex - 1;
    if (newIndex < 0) {
        newIndex = state.players.length - 1;
    }
    return state.players[newIndex].playerId;
};
var nextPlayer = function (state) {
    var currentPlayerIndex = state.players.findIndex(function (player) { return player.playerId === state.activePlayerId; });
    var newIndex = currentPlayerIndex + 1;
    if (newIndex >= state.players.length) {
        newIndex = 0;
    }
    return state.players[newIndex].playerId;
};
var isLastPlayer = function (state, playerId) {
    return state.players[state.players.length - 1].playerId === playerId;
};
var resourceFromBankToPlayer = function (state, playerId, resourceType, quantity) {
    var _a;
    console.log("here");
    console.log(state.bank, resourceType, quantity);
    if (state.bank[resourceType] >= quantity) {
        var newTotal = state.bank[resourceType] - quantity;
        return __assign(__assign({}, state), { bank: __assign(__assign({}, state.bank), (_a = {}, _a[resourceType] = newTotal, _a)), players: state.players.map(function (player) {
                var _a;
                if (playerId === playerId) {
                    var newQuantity = player.resources[resourceType] + quantity;
                    return __assign(__assign({}, player), { resources: __assign(__assign({}, player.resources), (_a = {}, _a[resourceType] = newQuantity, _a)) });
                }
                return player;
            }) });
    }
    throw new Error("Not enough resources");
};
var collectResourceFromTile = function (state, playerId, tileLocation) {
    var gameTile = board_utils_1.findTile(state.board.tiles, tileLocation);
    if (gameTile) {
        var tileType = gameTile.tileType;
        if (Object.values(types_1.ResourceType).includes(tileType)) {
            var resourceType = tileType;
            console.log("ehre", state, playerId, resourceType, 1);
            return resourceFromBankToPlayer(state, playerId, resourceType, 1);
        }
    }
    else {
        console.warn("Could not find game tile " + tileLocation);
    }
    return state;
};
var buildSettlement = function (state, playerId, action) {
    if (state.activePlayerId !== playerId) {
        throw new Error("Not your turn");
    }
    if (action.name !== "buildSettlement") {
        throw Error("Invalid action");
    }
    var location = board_utils_1.getCommonVertexCoordinate(state.board.tiles, action.location);
    /// TODO: Enforce distance rule
    if (isVertexEmpty(state, location)) {
        state.buildings = __spreadArrays(state.buildings, [
            {
                location: location,
                type: types_1.BuildingType.Settlement,
                playerId: playerId
            },
        ]);
    }
    else {
        throw new Error("There is already a building there");
    }
    if (state.phase === types_1.GamePhase.SETUP_ROUND_1) {
        /// During setup, after placing a settlement, they have to place a road
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_ROAD;
    }
    if (state.phase === types_1.GamePhase.SETUP_ROUND_2) {
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_ROAD;
        console.log(board_utils_1.tilesTouchingVertex(state.board.tiles, location));
        board_utils_1.tilesTouchingVertex(state.board.tiles, location).forEach(function (tile) {
            state = collectResourceFromTile(state, playerId, tile.location);
        });
    }
    return state;
};
var buildRoad = function (state, playerId, action) {
    if (state.activePlayerId !== playerId) {
        throw new Error("Not your turn");
    }
    if (action.name !== "buildRoad") {
        throw Error("Invalid action");
    }
    var location = board_utils_1.getCommonEdgeCoordinate(state.board.tiles, action.location);
    /// TODO: Enforce that you have to build a road where you have a settlement
    if (isEdgeEmpty(state, location)) {
        state.roads = __spreadArrays(state.roads, [
            {
                location: location,
                playerId: playerId
            },
        ]);
    }
    else {
        throw new Error("There is already a road there");
    }
    if (state.phase === types_1.GamePhase.SETUP_ROUND_1) {
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_SETTLEMENT;
        if (isLastPlayer(state, state.activePlayerId)) {
            state.phase = types_1.GamePhase.SETUP_ROUND_2;
        }
        else {
            state.activePlayerId = nextPlayer(state);
        }
    }
    else if (state.phase === types_1.GamePhase.SETUP_ROUND_2) {
        if (isLastPlayer(state, state.activePlayerId)) {
            state.activePlayerId = state.players[0].playerId;
            state.activePlayerTurnState = types_1.PlayerTurnState.IDLE;
            state.phase = types_1.GamePhase.PLAYING;
        }
        else {
            state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_SETTLEMENT;
            state.activePlayerId = previousPlayer(state);
        }
    }
    return state;
};
var actionMap = {
    buildSettlement: buildSettlement,
    buildRoad: buildRoad
};
exports["default"] = actionMap;
