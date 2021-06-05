"use strict";
exports.__esModule = true;
var layout_1 = require("@chakra-ui/layout");
var react_1 = require("react");
var react_2 = require("@chakra-ui/react");
var responsiveUtils_1 = require("../responsiveUtils");
var Bank_1 = require("./Bank");
var GameBoard_1 = require("./GameBoard");
var Resources_1 = require("./Resources");
var Players_1 = require("./Players");
var Actions_1 = require("./Actions");
var GameView_1 = require("./GameView");
var game_types_1 = require("../state/game_types");
var GameColumn = function (_a) {
    var flex = _a.flex, _b = _a.minWidth, minWidth = _b === void 0 ? "inherit" : _b, children = _a.children, _c = _a.hiddenOn, hiddenOn = _c === void 0 ? "none" : _c, _d = _a.shownOn, shownOn = _d === void 0 ? "none" : _d;
    return (react_1["default"].createElement(layout_1.Box, { flex: flex, minW: minWidth, alignSelf: "stretch", display: responsiveUtils_1.responsiveVisibiity(hiddenOn, shownOn, "flex", "none"), flexDir: "column", p: "1" }, children));
};
var TabContainer = function (_a) {
    var children = _a.children, _b = _a.flex, flex = _b === void 0 ? "initial" : _b, _c = _a.hiddenOn, hiddenOn = _c === void 0 ? "none" : _c, _d = _a.shownOn, shownOn = _d === void 0 ? "none" : _d;
    return (react_1["default"].createElement(layout_1.Box, { p: 1, flex: flex, flexDir: "column", display: responsiveUtils_1.responsiveVisibiity(hiddenOn, shownOn, "flex", "none") }, children));
};
var TabSet = function (_a) {
    var tabs = _a.tabs;
    return (react_1["default"].createElement(react_2.Tabs, { variant: "enclosed", flex: "1", display: "flex", flexDir: "column" },
        react_1["default"].createElement(react_2.TabList, null, tabs
            .filter(function (_a) {
            var shownIf = _a.shownIf;
            return (shownIf != undefined ? shownIf : true);
        })
            .map(function (_a) {
            var name = _a.name, hiddenOn = _a.hiddenOn, shownOn = _a.shownOn;
            return (react_1["default"].createElement(react_2.Tab, { display: responsiveUtils_1.responsiveVisibiity(hiddenOn, shownOn, "inherit", "none") }, name));
        })),
        react_1["default"].createElement(react_2.TabPanels, { borderStyle: "solid", borderWidth: "thin", borderTop: "none", flex: "1", roundedBottom: "md" }, tabs.map(function (_a) {
            var hiddenOn = _a.hiddenOn, shownOn = _a.shownOn, ContentComponent = _a.content;
            return (react_1["default"].createElement(react_2.TabPanel, { display: responsiveUtils_1.responsiveVisibiity(hiddenOn, shownOn, "inherit", "none") },
                react_1["default"].createElement(ContentComponent, null)));
        }))));
};
var GameLayout = function () {
    var state = GameView_1.useGameViewState().gameState.state;
    var yourTurn = state.activePlayerId === state.you.playerId &&
        state.phase === game_types_1.GamePhase.PLAYING;
    var Chat = function () { return react_1["default"].createElement("div", null, "Chat"); };
    return (react_1["default"].createElement(layout_1.Box, { flex: "1", display: "flex" },
        react_1["default"].createElement(GameColumn, { flex: "1", hiddenOn: "md" },
            react_1["default"].createElement(TabContainer, null,
                react_1["default"].createElement(TabSet, { tabs: [{ name: "Bank", content: Bank_1["default"] }] })),
            react_1["default"].createElement(TabContainer, { flex: "1" },
                react_1["default"].createElement(TabSet, { tabs: [{ name: "Players", content: Players_1["default"] }] }))),
        react_1["default"].createElement(GameColumn, { flex: "2" },
            react_1["default"].createElement(layout_1.Box, { bgColor: "blue.800", flex: "1", alignSelf: "stretch", display: responsiveUtils_1.responsiveVisibiity("xs", "none", "inherit", "none") },
                react_1["default"].createElement(GameBoard_1["default"], null)),
            react_1["default"].createElement(TabContainer, { shownOn: "xs", flex: "1" },
                react_1["default"].createElement(TabSet, { tabs: [
                        {
                            name: "Game Board",
                            shownOn: "xs",
                            content: function () { return (react_1["default"].createElement(layout_1.Box, { bgColor: "blue.800", flex: "1", alignSelf: "stretch", minHeight: "400px" },
                                react_1["default"].createElement(GameBoard_1["default"], null))); }
                        },
                        { name: "Players", content: Players_1["default"] },
                        { name: "Chat", content: Chat },
                    ] })),
            react_1["default"].createElement(TabContainer, null,
                react_1["default"].createElement(TabSet, { tabs: [
                        { name: "Resources", content: Resources_1["default"] },
                        {
                            name: "Bank",
                            shownOn: "xs",
                            content: function () { return react_1["default"].createElement(Bank_1["default"], null); }
                        },
                        {
                            name: "Actions",
                            content: Actions_1["default"],
                            shownOn: "xs",
                            shownIf: yourTurn
                        },
                    ] }))),
        react_1["default"].createElement(GameColumn, { flex: "1", hiddenOn: "xs" },
            react_1["default"].createElement(TabContainer, { shownOn: "md" },
                react_1["default"].createElement(TabSet, { tabs: [
                        {
                            name: "Bank",
                            content: function () { return react_1["default"].createElement(Bank_1["default"], null); }
                        },
                    ] })),
            react_1["default"].createElement(TabContainer, { flex: "2" },
                react_1["default"].createElement(TabSet, { tabs: [
                        { name: "Chat", content: Chat },
                        {
                            name: "Players",
                            shownOn: "md",
                            content: Players_1["default"]
                        },
                    ] })),
            yourTurn && (react_1["default"].createElement(TabContainer, { flex: "1" },
                react_1["default"].createElement(TabSet, { tabs: [{ name: "Actions", content: Actions_1["default"] }] }))))));
};
exports["default"] = GameLayout;
