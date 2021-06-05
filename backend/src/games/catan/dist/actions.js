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
var lodash_1 = require("lodash");
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
var getPlayer = function (state, playerId) {
    var player = state.players.find(function (player) { return player.playerId === playerId; });
    if (player) {
        return player;
    }
    throw new Error("Unable to find player with playerId " + playerId);
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
var isFirstPlayer = function (state, playerId) {
    return state.players[0].playerId === playerId;
};
var isLastPlayer = function (state, playerId) {
    return state.players[state.players.length - 1].playerId === playerId;
};
var canBuildRoad = function (player) {
    return player.resources.brick >= 1 && player.resources.wood >= 1;
};
var canBuildSettlement = function (player) {
    return player.resources.brick >= 1 &&
        player.resources.wood >= 1 &&
        player.resources.sheep >= 1 &&
        player.resources.wheat >= 1;
};
var canBuildCity = function (player) {
    return player.resources.ore >= 3 && player.resources.wheat >= 2;
};
var canBuyDevelopmentCard = function (player) {
    return player.resources.ore >= 1 &&
        player.resources.sheep >= 1 &&
        player.resources.wheat >= 1;
};
var resourceFromBankToPlayer = function (state, playerId, resourceType, quantity) {
    var _a;
    if (state.bank[resourceType] >= quantity) {
        var newTotal = state.bank[resourceType] - quantity;
        return __assign(__assign({}, state), { bank: __assign(__assign({}, state.bank), (_a = {}, _a[resourceType] = newTotal, _a)), players: state.players.map(function (player) {
                var _a;
                if (playerId === player.playerId) {
                    var newQuantity = player.resources[resourceType] + quantity;
                    return __assign(__assign({}, player), { resources: __assign(__assign({}, player.resources), (_a = {}, _a[resourceType] = newQuantity, _a)) });
                }
                return player;
            }) });
    }
    throw new Error("Not enough resources");
};
var collectResourceFromTile = function (state, playerId, gameTile, quantity) {
    var tileType = gameTile.tileType;
    if (Object.values(types_1.ResourceType).includes(tileType)) {
        var resourceType = tileType;
        return resourceFromBankToPlayer(state, playerId, resourceType, quantity);
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
    var player = getPlayer(state, playerId);
    var location = board_utils_1.getCommonVertexCoordinate(state.board.tiles, action.location);
    if (state.phase === types_1.GamePhase.PLAYING) {
        if (!canBuildSettlement(player)) {
            throw new Error("Not enough resources to build settlement");
        }
    }
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
    if (state.phase === types_1.GamePhase.PLAYING) {
        /// Pay for the settlement
        state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.BRICK, -1);
        state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.WOOD, -1);
        state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.SHEEP, -1);
        state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.WHEAT, -1);
        state.activePlayerTurnState = types_1.PlayerTurnState.IDLE;
    }
    else if (state.phase === types_1.GamePhase.SETUP_ROUND_1) {
        /// During setup, after placing a settlement they have to place a road
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_ROAD;
    }
    else if (state.phase === types_1.GamePhase.SETUP_ROUND_2) {
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_ROAD;
        board_utils_1.tilesTouchingVertex(state.board.tiles, location).forEach(function (tile) {
            state = collectResourceFromTile(state, playerId, tile, 1);
        });
    }
    return state;
};
var buildCity = function (state, playerId, action) {
    if (state.activePlayerId !== playerId) {
        throw new Error("Not your turn");
    }
    if (action.name !== "buildCity" || state.phase !== types_1.GamePhase.PLAYING) {
        throw Error("Invalid action");
    }
    var location = board_utils_1.getCommonVertexCoordinate(state.board.tiles, action.location);
    var player = getPlayer(state, playerId);
    if (!canBuildCity(player)) {
        throw new Error("Not enough resources to build a city");
    }
    var existingSettlement = state.buildings.find(function (building) {
        return building.playerId === playerId &&
            building.type === types_1.BuildingType.Settlement &&
            board_utils_1.vertexCoordinateEqual(location, board_utils_1.getCommonVertexCoordinate(state.board.tiles, action.location));
    });
    if (existingSettlement) {
        state.buildings = __spreadArrays(state.buildings, [
            {
                location: location,
                type: types_1.BuildingType.City,
                playerId: playerId
            },
        ]);
    }
    else {
        throw new Error("You must have an existing settlement to build a city");
    }
    /// Pay for the city
    state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.ORE, -3);
    state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.WHEAT, -2);
    state.activePlayerTurnState = types_1.PlayerTurnState.IDLE;
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
    var player = getPlayer(state, playerId);
    if (state.phase === types_1.GamePhase.PLAYING) {
        if (!canBuildRoad(player)) {
            throw new Error("Not enough resources to build a road");
        }
    }
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
    if (state.phase === types_1.GamePhase.PLAYING) {
        /// Pay for the road
        state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.BRICK, -1);
        state = resourceFromBankToPlayer(state, playerId, types_1.ResourceType.WOOD, -1);
        state.activePlayerTurnState = types_1.PlayerTurnState.IDLE;
    }
    else if (state.phase === types_1.GamePhase.SETUP_ROUND_1) {
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_SETTLEMENT;
        if (isLastPlayer(state, state.activePlayerId)) {
            state.phase = types_1.GamePhase.SETUP_ROUND_2;
        }
        else {
            state.activePlayerId = nextPlayer(state);
        }
    }
    else if (state.phase === types_1.GamePhase.SETUP_ROUND_2) {
        if (isFirstPlayer(state, state.activePlayerId)) {
            state.activePlayerId = state.players[0].playerId;
            state.activePlayerTurnState = types_1.PlayerTurnState.MUST_ROLL;
            state.phase = types_1.GamePhase.PLAYING;
        }
        else {
            state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_SETTLEMENT;
            state.activePlayerId = previousPlayer(state);
        }
    }
    return state;
};
var rollDice = function (state, playerId, action) {
    if (state.activePlayerId !== playerId) {
        throw new Error("Not your turn");
    }
    if (action.name !== "rollDice") {
        throw Error("Invalid action");
    }
    var tiles = state.board.tiles;
    var diceTotal = lodash_1.sum(action.values);
    state.buildings.map(function (_a) {
        var type = _a.type, location = _a.location, tilesPlayerId = _a.playerId;
        board_utils_1.tilesTouchingVertex(tiles, location)
            .filter(function (_a) {
            var diceNumber = _a.diceNumber;
            return diceNumber === diceTotal;
        })
            .forEach(function (gameTile) {
            if (type === types_1.BuildingType.Settlement) {
                state = collectResourceFromTile(state, tilesPlayerId, gameTile, 1);
            }
            else if (type === types_1.BuildingType.City) {
                state = collectResourceFromTile(state, tilesPlayerId, gameTile, 2);
            }
        });
    });
    state.activePlayerTurnState = types_1.PlayerTurnState.IDLE;
    return state;
};
var changeTurnAction = function (state, playerId, action) {
    if (state.activePlayerId !== playerId) {
        throw new Error("Not your turn");
    }
    if (action.name !== "changeTurnAction") {
        throw Error("Invalid action");
    }
    if (action.turnAction === "buildCity") {
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_CITY;
    }
    else if (action.turnAction === "buildSettlement") {
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_SETTLEMENT;
    }
    else if (action.turnAction === "buildRoad") {
        state.activePlayerTurnState = types_1.PlayerTurnState.PLACING_ROAD;
    }
    else if (action.turnAction === "idle") {
        state.activePlayerTurnState = types_1.PlayerTurnState.IDLE;
    }
    else {
        throw Error("Invalid turn action");
    }
    return state;
};
var endTurn = function (state, playerId, action) {
    if (state.activePlayerId !== playerId) {
        throw new Error("Not your turn");
    }
    if (action.name !== "endTurn") {
        throw Error("Invalid action");
    }
    state.activePlayerTurnState = types_1.PlayerTurnState.MUST_ROLL;
    state.activePlayerId = nextPlayer(state);
    return state;
};
var actionMap = {
    buildSettlement: buildSettlement,
    buildCity: buildCity,
    buildRoad: buildRoad,
    rollDice: rollDice,
    changeTurnAction: changeTurnAction,
    endTurn: endTurn
};
exports["default"] = actionMap;
