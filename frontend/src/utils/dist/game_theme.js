"use strict";
var _a, _b;
exports.__esModule = true;
exports.resources = void 0;
var fa_1 = require("react-icons/fa");
var game_types_1 = require("../state/game_types");
exports.resources = [
    game_types_1.ResourceType.WHEAT,
    game_types_1.ResourceType.WOOD,
    game_types_1.ResourceType.ORE,
    game_types_1.ResourceType.BRICK,
    game_types_1.ResourceType.SHEEP,
];
var theme = {
    resources: (_a = {},
        _a[game_types_1.ResourceType.WHEAT] = {
            name: "dev",
            pluralName: "devs",
            label: "Developers",
            icon: fa_1.FaIdBadge
        },
        _a[game_types_1.ResourceType.WOOD] = {
            name: "intern",
            pluralName: "interns",
            label: "Interns",
            icon: fa_1.FaGraduationCap
        },
        _a[game_types_1.ResourceType.ORE] = {
            name: "shuttle bus",
            pluralName: "shuttle busses",
            label: "Shuttle busses",
            icon: fa_1.FaBus
        },
        _a[game_types_1.ResourceType.BRICK] = {
            name: "server",
            pluralName: "servers",
            label: "Servers",
            icon: fa_1.FaServer
        },
        _a[game_types_1.ResourceType.SHEEP] = {
            name: "snack",
            pluralName: "snacks",
            label: "Snacks",
            icon: fa_1.FaCoffee
        },
        _a),
    buildings: {
        road: {
            name: "fiber",
            pluralName: "fiber cables",
            label: "Fiber cable",
            icon: fa_1.FaNetworkWired
        },
        settlement: {
            name: "garage",
            pluralName: "garages",
            label: "Garages",
            icon: fa_1.FaWarehouse
        },
        city: {
            name: "office",
            pluralName: "offices",
            label: "Office",
            icon: fa_1.FaBuilding
        }
    },
    playerColors: (_b = {},
        _b[game_types_1.PlayerColor.Red] = {
            primary: "#FF0000"
        },
        _b[game_types_1.PlayerColor.Green] = {
            primary: "#00FF00"
        },
        _b[game_types_1.PlayerColor.Blue] = {
            primary: "#0000FF"
        },
        _b[game_types_1.PlayerColor.Purple] = {
            primary: "#FF00FF"
        },
        _b[game_types_1.PlayerColor.Teal] = {
            primary: "#00FFFF"
        },
        _b[game_types_1.PlayerColor.Orange] = {
            primary: "#FFFF00"
        },
        _b)
};
exports["default"] = theme;
