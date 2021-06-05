"use strict";
exports.__esModule = true;
exports.PlayerColor = exports.PlayerTurnState = exports.BuildingType = exports.TileType = exports.PortResource = exports.ResourceType = exports.GamePhase = void 0;
var GamePhase;
(function (GamePhase) {
    GamePhase["SETUP_ROUND_1"] = "setup1";
    GamePhase["SETUP_ROUND_2"] = "setup2";
    GamePhase["PLAYING"] = "playing";
    GamePhase["ROBBER_ROLLER"] = "robber_rolled";
})(GamePhase = exports.GamePhase || (exports.GamePhase = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["BRICK"] = "brick";
    ResourceType["WOOD"] = "wood";
    ResourceType["ORE"] = "ore";
    ResourceType["WHEAT"] = "wheat";
    ResourceType["SHEEP"] = "sheep";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
var PortResource;
(function (PortResource) {
    PortResource["BRICK"] = "brick";
    PortResource["WOOD"] = "wood";
    PortResource["ORE"] = "ore";
    PortResource["WHEAT"] = "wheat";
    PortResource["SHEEP"] = "sheep";
    PortResource["ANY"] = "any";
})(PortResource = exports.PortResource || (exports.PortResource = {}));
var TileType;
(function (TileType) {
    TileType["BRICK"] = "brick";
    TileType["WOOD"] = "wood";
    TileType["ORE"] = "ore";
    TileType["WHEAT"] = "wheat";
    TileType["SHEEP"] = "sheep";
    TileType["DESERT"] = "desert";
})(TileType = exports.TileType || (exports.TileType = {}));
var BuildingType;
(function (BuildingType) {
    BuildingType["Settlement"] = "settlement";
    BuildingType["City"] = "city";
})(BuildingType = exports.BuildingType || (exports.BuildingType = {}));
var PlayerTurnState;
(function (PlayerTurnState) {
    PlayerTurnState["IDLE"] = "idle";
    PlayerTurnState["MUST_ROLL"] = "mustRoll";
    PlayerTurnState["PLACING_SETTLEMENT"] = "placingSettlement";
    PlayerTurnState["PLACING_CITY"] = "placingCity";
    PlayerTurnState["PLACING_ROAD"] = "placingRoad";
})(PlayerTurnState = exports.PlayerTurnState || (exports.PlayerTurnState = {}));
var PlayerColor;
(function (PlayerColor) {
    PlayerColor["Red"] = "red";
    PlayerColor["Green"] = "green";
    PlayerColor["Blue"] = "blue";
    PlayerColor["Orange"] = "orange";
    PlayerColor["Purple"] = "purple";
    PlayerColor["Teal"] = "teal";
})(PlayerColor = exports.PlayerColor || (exports.PlayerColor = {}));
