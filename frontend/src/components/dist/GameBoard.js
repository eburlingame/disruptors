"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var layout_1 = require("@chakra-ui/layout");
var react_1 = require("react");
var lodash_1 = require("lodash");
var GameView_1 = require("./GameView");
var hexagon_svg_1 = require("../images/hexagon.svg");
var styled_components_1 = require("styled-components");
var game_types_1 = require("../state/game_types");
var game_theme_1 = require("../utils/game_theme");
var button_1 = require("@chakra-ui/button");
var fa_1 = require("react-icons/fa");
var utils_1 = require("../utils/utils");
var board_utils_1 = require("../utils/board_utils");
var session_1 = require("../hooks/session");
var game_1 = require("../hooks/game");
var Container = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  min-height: 400px;\n  overflow: hidden;\n  position: relative;\n  background-color: #111;\n"], ["\n  width: 100%;\n  height: 100%;\n  min-height: 400px;\n  overflow: hidden;\n  position: relative;\n  background-color: #111;\n"])));
var OverflowContainer = styled_components_1["default"].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n  position: relative;\n"], ["\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n  position: relative;\n"])));
var TILE_WIDTH = 146;
var TILE_HEIGHT = 169;
var BOARD_PADDING = 200;
var CONTAINER_WIDTH = 5 * TILE_WIDTH + BOARD_PADDING;
var CONTAINER_HEIGHT = 4 * TILE_HEIGHT + BOARD_PADDING;
var ZoomControls = styled_components_1["default"].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  z-index: 4;\n"], ["\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  z-index: 4;\n"])));
var DiceValueContainer = styled_components_1["default"].div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 10px;\n  right: 10px;\n  z-index: 4;\n  background-color: #121212;\n  border-radius: 0.5em;\n  font-size: 20pt;\n  padding: 0.5em;\n  font-weight: 700;\n"], ["\n  position: absolute;\n  bottom: 10px;\n  right: 10px;\n  z-index: 4;\n  background-color: #121212;\n  border-radius: 0.5em;\n  font-size: 20pt;\n  padding: 0.5em;\n  font-weight: 700;\n"])));
var DiceValueContainerTitle = styled_components_1["default"].div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 12pt;\n  color: #d8d8d8;\n  font-weight: 400;\n"], ["\n  font-size: 12pt;\n  color: #d8d8d8;\n  font-weight: 400;\n"])));
var TileContainer = styled_components_1["default"].div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: absolute;\n  // top: 50%;\n  // left: 50%;\n  // transform: translate(-50%, -50%);\n\n  background-color: #111;\n  width: ", "px;\n  height: ", "px;\n"], ["\n  position: absolute;\n  // top: 50%;\n  // left: 50%;\n  // transform: translate(-50%, -50%);\n\n  background-color: #111;\n  width: ", "px;\n  height: ", "px;\n"])), function (props) { return CONTAINER_WIDTH * props.zoom; }, function (props) { return CONTAINER_HEIGHT * props.zoom; });
var TileOriginContainer = styled_components_1["default"].div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: scale(", ");\n"], ["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: scale(", ");\n"])), function (props) { return props.zoom; });
var TileImage = styled_components_1["default"].img(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  position: absolute;\n  top: 10px;\n  left: -11px;\n\n  transform: rotate(90deg);\n  z-index: 1;\n\n  max-width: initial;\n"], ["\n  position: absolute;\n  top: 10px;\n  left: -11px;\n\n  transform: rotate(90deg);\n  z-index: 1;\n\n  max-width: initial;\n"])));
var DebugLabel = styled_components_1["default"].div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: #000;\n  position: absolute;\n  top: 50%;\n  width: 100%;\n  z-index: 2;\n  text-align: center;\n"], ["\n  color: #000;\n  position: absolute;\n  top: 50%;\n  width: 100%;\n  z-index: 2;\n  text-align: center;\n"])));
var TileLabel = styled_components_1["default"].div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  color: #000;\n  position: absolute;\n  top: 50%;\n  width: 100%;\n  z-index: 2;\n  text-align: center;\n  transform: translate(0%, -50%);\n"], ["\n  color: #000;\n  position: absolute;\n  top: 50%;\n  width: 100%;\n  z-index: 2;\n  text-align: center;\n  transform: translate(0%, -50%);\n"])));
var Tile = styled_components_1["default"].div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  width: ", "px;\n  height: ", "px;\n\n  position: absolute;\n  left: ", ";\n  top: ", ";\n  transform: translate(-50%, -50%);\n"], ["\n  width: ", "px;\n  height: ", "px;\n\n  position: absolute;\n  left: ", ";\n  top: ", ";\n  transform: translate(-50%, -50%);\n"])), TILE_WIDTH, TILE_HEIGHT, function (props) { return props.position.x * TILE_WIDTH * 0.5 + "px"; }, function (props) { return -props.position.y * TILE_HEIGHT * 0.75 + "px"; });
var EdgesContainer = styled_components_1["default"](Tile)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  z-index: 2;\n"], ["\n  z-index: 2;\n"])));
var VertexesContainer = styled_components_1["default"](Tile)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  z-index: 3;\n"], ["\n  z-index: 3;\n"])));
var ButtonsContainer = styled_components_1["default"](Tile)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  z-index: 4;\n  width: 0px;\n  height: 0px;\n"], ["\n  z-index: 4;\n  width: 0px;\n  height: 0px;\n"])));
var vertexIndexToPosition = function (index) { return ({
    x: (Math.cos((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_HEIGHT) / 2.0,
    y: (Math.sin((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_HEIGHT) / 2.0
}); };
var edgeIndexToPosition = function (index) { return ({
    x: (Math.cos((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_WIDTH) / 2.0,
    y: (Math.sin((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_WIDTH) / 2.0
}); };
var EdgeContainer = styled_components_1["default"].div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  position: absolute;\n  z-index: 3;\n\n  top: 50%;\n  left: 50%;\n  transform: translate(\n    calc(-50% + ", "px),\n    calc(-50% + ", "px)\n  );\n  text-align: center;\n  width: 25px;\n  height: 25px;\n"], ["\n  position: absolute;\n  z-index: 3;\n\n  top: 50%;\n  left: 50%;\n  transform: translate(\n    calc(-50% + ", "px),\n    calc(-50% + ", "px)\n  );\n  text-align: center;\n  width: 25px;\n  height: 25px;\n"])), function (props) { return edgeIndexToPosition(props.index + 0.5).x; }, function (props) { return edgeIndexToPosition(props.index + 0.5).y; });
var rad2deg = function (radians) { return (radians / Math.PI) * 180; };
var deg2rad = function (degrees) { return (degrees / 180) * Math.PI; };
var edgeLength = TILE_WIDTH * Math.sin(deg2rad(30));
var EdgeLine = styled_components_1["default"].div(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  z-index: 2;\n\n  top: 50%;\n  left: 50%;\n  position: absolute;\n  border-top: 4px solid ", ";\n  width: ", "px;\n  transform: translate(-50%, -5px)\n    rotate(", "deg);\n\n  border-top: solid 4px ", ";\n  transition: outline 0.6s linear;\n  border-radius: 5px;\n\n  // @keyframes shimmer {\n  //   0% {\n  //     border-top-style: dashed;\n  //   }\n  //   50% {\n  //     border-top-style: dotted;\n  //   }\n  //   100% {\n  //     border-top-style: dashed;\n  //   }\n  // }\n\n  // animation-name: shimmer;\n  // animation-duration: 0.5s;\n  // animation-iteration-count: infinite;\n"], ["\n  z-index: 2;\n\n  top: 50%;\n  left: 50%;\n  position: absolute;\n  border-top: 4px solid ", ";\n  width: ", "px;\n  transform: translate(-50%, -5px)\n    rotate(", "deg);\n\n  border-top: solid 4px ", ";\n  transition: outline 0.6s linear;\n  border-radius: 5px;\n\n  // @keyframes shimmer {\n  //   0% {\n  //     border-top-style: dashed;\n  //   }\n  //   50% {\n  //     border-top-style: dotted;\n  //   }\n  //   100% {\n  //     border-top-style: dashed;\n  //   }\n  // }\n\n  // animation-name: shimmer;\n  // animation-duration: 0.5s;\n  // animation-iteration-count: infinite;\n"])), function (props) { return props.color; }, edgeLength + 14, function (props) { return props.index * 60 + 30; }, function (props) { return props.color; });
var VertexContainer = styled_components_1["default"].div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  position: absolute;\n  z-index: 3;\n\n  top: 50%;\n  left: 50%;\n  transform: translate(\n    calc(-50% + ", "px),\n    calc(-50% + ", "px)\n  );\n\n  text-align: center;\n  width: 25px;\n  height: 25px;\n"], ["\n  position: absolute;\n  z-index: 3;\n\n  top: 50%;\n  left: 50%;\n  transform: translate(\n    calc(-50% + ", "px),\n    calc(-50% + ", "px)\n  );\n\n  text-align: center;\n  width: 25px;\n  height: 25px;\n"])), function (props) { return vertexIndexToPosition(props.index).x; }, function (props) { return vertexIndexToPosition(props.index).y; });
var Building = styled_components_1["default"].div(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  position: absolute;\n  left: 0px;\n  top: 0px;\n\n  width: 28px;\n  height: 28px;\n  border-radius: 0.25em;\n  background-color: ", ";\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"], ["\n  position: absolute;\n  left: 0px;\n  top: 0px;\n\n  width: 28px;\n  height: 28px;\n  border-radius: 0.25em;\n  background-color: ", ";\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"])), function (props) { return props.playerColor; });
/// Since tiles touch each vertex, only draw the "common" vertex
var shouldDrawVertex = function (tiles, position, vertexIndex) {
    var vertexCoord = {
        tile: position,
        vertexIndex: vertexIndex
    };
    var commonVertex = board_utils_1.getCommonVertexCoordinate(tiles, vertexCoord);
    return board_utils_1.vertexCoordinateEqual(commonVertex, vertexCoord);
};
/// Since multiple touch each vertex, only draw the "common" edge
var shouldDrawEdge = function (tiles, position, edgeIndex) {
    var edgeCoord = {
        tile: position,
        edgeIndex: edgeIndex
    };
    var commonEdge = board_utils_1.getCommonEdgeCoordinate(tiles, edgeCoord);
    return board_utils_1.edgeCoordinateEqual(commonEdge, edgeCoord);
};
var GameBoard = function (_a) {
    var you = session_1.useSessionState().you;
    var gameState = GameView_1.useGameViewState().gameState;
    var _b = gameState.state, players = _b.players, tiles = _b.board.tiles, buildings = _b.buildings, roads = _b.roads;
    var _c = react_1.useState(1.0), zoom = _c[0], setZoom = _c[1];
    var zoomIn = function () {
        return setZoom(function (current) { return (current < 2.75 ? current + 0.25 : current); });
    };
    var zoomOut = function () {
        return setZoom(function (current) { return (current > 0.25 ? current - 0.25 : current); });
    };
    var _d = gameState.state, activePlayerId = _d.activePlayerId, activePlayerTurnState = _d.activePlayerTurnState;
    var lastDiceRoll = lodash_1.last(gameState.actions
        .filter(function (_a) {
        var name = _a.name;
        return name === "rollDice";
    })
        .map(function (a) { return a; }));
    var yourTurn = you && you.playerId === activePlayerId;
    var placingRoad = yourTurn && activePlayerTurnState === game_types_1.PlayerTurnState.PLACING_ROAD;
    var placingCity = activePlayerTurnState === game_types_1.PlayerTurnState.PLACING_CITY;
    var placingSettlement = activePlayerTurnState === game_types_1.PlayerTurnState.PLACING_SETTLEMENT;
    var placingBuilding = yourTurn && (placingCity || placingSettlement);
    var performAction = game_1.useGameAction().performAction;
    var onPlaceBuilding = function (location) { return function () { return __awaiter(void 0, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!placingBuilding) return [3 /*break*/, 2];
                    action = {
                        name: activePlayerTurnState === game_types_1.PlayerTurnState.PLACING_CITY
                            ? "buildCity"
                            : "buildSettlement",
                        location: location
                    };
                    return [4 /*yield*/, performAction(action)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }; };
    var onPlaceRoad = function (location) { return function () { return __awaiter(void 0, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!placingRoad) return [3 /*break*/, 2];
                    action = {
                        name: "buildRoad",
                        location: location
                    };
                    return [4 /*yield*/, performAction(action)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }; };
    var roadExists = function (tile, edgeIndex) {
        return roads.find(function (road) {
            return board_utils_1.edgeCoordinateEqual({ tile: tile, edgeIndex: edgeIndex }, road.location);
        }) != undefined;
    };
    var buildingExists = function (tile, vertexIndex) {
        return buildings.find(function (building) {
            return board_utils_1.vertexCoordinateEqual({ tile: tile, vertexIndex: vertexIndex }, building.location);
        }) != undefined;
    };
    var settlementExists = function (playerId, tile, vertexIndex) {
        return buildings
            .filter(function (building) {
            return building.type === game_types_1.BuildingType.Settlement &&
                building.playerId === playerId;
        })
            .find(function (building) {
            return board_utils_1.vertexCoordinateEqual({ tile: tile, vertexIndex: vertexIndex }, building.location);
        }) != undefined;
    };
    var renderRoad = function (tile, edgeIndex) {
        var roadColor = "#ddd";
        var road = roads.find(function (road) {
            return board_utils_1.edgeCoordinateEqual({ tile: tile, edgeIndex: edgeIndex }, road.location);
        });
        if (road) {
            var player = players.find(function (_a) {
                var playerId = _a.playerId;
                return playerId === road.playerId;
            });
            if (player) {
                roadColor = game_theme_1["default"].playerColors[player.color].primary;
            }
        }
        return react_1["default"].createElement(EdgeLine, { index: edgeIndex, color: roadColor });
    };
    var renderBuilding = function (tile, vertexIndex) {
        var SettlementIcon = game_theme_1["default"].buildings.settlement.icon;
        var CityIcon = game_theme_1["default"].buildings.city.icon;
        var building = buildings.find(function (building) {
            return board_utils_1.vertexCoordinateEqual({ tile: tile, vertexIndex: vertexIndex }, building.location);
        });
        if (building) {
            var player = players.find(function (_a) {
                var playerId = _a.playerId;
                return playerId === building.playerId;
            });
            if (player) {
                var color = game_theme_1["default"].playerColors[player.color].primary;
                if (building.type === game_types_1.BuildingType.Settlement) {
                    return (react_1["default"].createElement(Building, { playerColor: color },
                        react_1["default"].createElement(SettlementIcon, null)));
                }
                if (building.type === game_types_1.BuildingType.City) {
                    return (react_1["default"].createElement(Building, { playerColor: color },
                        react_1["default"].createElement(CityIcon, null)));
                }
            }
        }
        return react_1["default"].createElement(react_1["default"].Fragment, null);
    };
    return (react_1["default"].createElement(Container, null,
        react_1["default"].createElement(ZoomControls, null,
            react_1["default"].createElement(button_1.ButtonGroup, { isAttached: true, variant: "solid" },
                react_1["default"].createElement(button_1.IconButton, { "aria-label": "Zoom in", icon: react_1["default"].createElement(fa_1.FaSearchPlus, null), onClick: zoomIn, colorScheme: "blue" }),
                react_1["default"].createElement(button_1.IconButton, { "aria-label": "Zoom out", icon: react_1["default"].createElement(fa_1.FaSearchMinus, null), onClick: zoomOut, colorScheme: "blue" }))),
        lastDiceRoll && (react_1["default"].createElement(DiceValueContainer, null,
            react_1["default"].createElement(DiceValueContainerTitle, null, "Last roll:"),
            lastDiceRoll.values[0],
            " + ",
            lastDiceRoll.values[1],
            " =",
            " ",
            lastDiceRoll.values[0] + lastDiceRoll.values[1])),
        react_1["default"].createElement(OverflowContainer, null,
            react_1["default"].createElement(TileContainer, { zoom: zoom },
                react_1["default"].createElement(TileOriginContainer, { zoom: zoom }, tiles.map(function (_a) {
                    var diceNumber = _a.diceNumber, tileType = _a.tileType, _b = _a.location, x = _b.x, y = _b.y, z = _b.z;
                    return (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(Tile, { position: board_utils_1.locationToPosition({ x: x, y: y, z: z }) },
                            react_1["default"].createElement(TileLabel, null,
                                tileType == game_types_1.TileType.DESERT
                                    ? ""
                                    : game_theme_1["default"].resources[tileType].label,
                                react_1["default"].createElement(layout_1.Box, { fontSize: "xl", fontWeight: "700" }, diceNumber > 0 ? diceNumber : "")),
                            react_1["default"].createElement(TileImage, { src: hexagon_svg_1["default"] })),
                        react_1["default"].createElement(EdgesContainer, { position: board_utils_1.locationToPosition({ x: x, y: y, z: z }) }, utils_1.range(6)
                            .filter(function (index) {
                            return shouldDrawEdge(tiles, { x: x, y: y, z: z }, index);
                        })
                            .map(function (index) { return (react_1["default"].createElement(EdgeContainer, { index: index }, renderRoad({ x: x, y: y, z: z }, index))); })),
                        react_1["default"].createElement(VertexesContainer, { position: board_utils_1.locationToPosition({ x: x, y: y, z: z }) }, utils_1.range(6)
                            .filter(function (index) {
                            return shouldDrawVertex(tiles, { x: x, y: y, z: z }, index);
                        })
                            .map(function (index) { return (react_1["default"].createElement(VertexContainer, { index: index }, renderBuilding({ x: x, y: y, z: z }, index))); })),
                        react_1["default"].createElement(ButtonsContainer, { position: board_utils_1.locationToPosition({ x: x, y: y, z: z }) },
                            placingRoad &&
                                utils_1.range(6)
                                    .filter(function (index) {
                                    return shouldDrawEdge(tiles, { x: x, y: y, z: z }, index);
                                })
                                    .filter(function (index) { return !roadExists({ x: x, y: y, z: z }, index); })
                                    .map(function (index) { return (react_1["default"].createElement(EdgeContainer, { index: index },
                                    react_1["default"].createElement(button_1.IconButton, { zIndex: "4", position: "absolute", transform: "translate(-50%, 0%)", icon: react_1["default"].createElement(fa_1.FaHammer, null), "aria-label": "", variant: "solid", size: "xs", colorScheme: "blue", onClick: onPlaceRoad({
                                            tile: { x: x, y: y, z: z },
                                            edgeIndex: index
                                        }) }))); }),
                            placingBuilding &&
                                utils_1.range(6)
                                    .filter(function (index) {
                                    return shouldDrawVertex(tiles, { x: x, y: y, z: z }, index);
                                })
                                    .filter(function (index) {
                                    return placingCity
                                        ? settlementExists(you === null || you === void 0 ? void 0 : you.playerId, { x: x, y: y, z: z }, index)
                                        : !buildingExists({ x: x, y: y, z: z }, index);
                                })
                                    .map(function (index) { return (react_1["default"].createElement(VertexContainer, { index: index },
                                    react_1["default"].createElement(button_1.IconButton, { zIndex: "4", position: "absolute", transform: "translate(-50%, 0%)", icon: react_1["default"].createElement(fa_1.FaHammer, null), "aria-label": "", variant: "solid", size: "xs", colorScheme: "green", onClick: onPlaceBuilding({
                                            tile: { x: x, y: y, z: z },
                                            vertexIndex: index
                                        }) }))); }))));
                }))))));
};
exports["default"] = GameBoard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
