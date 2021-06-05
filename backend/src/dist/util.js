"use strict";
exports.__esModule = true;
exports.randomInt = exports.genRoomCode = exports.randomSelect = exports.errorResponse = exports.adhocResponse = exports.sucessResponse = void 0;
var lodash_1 = require("lodash");
exports.sucessResponse = function (request, data) { return ({
    sucess: true,
    reqId: request.reqId,
    v: request.v,
    d: data
}); };
exports.adhocResponse = function (verb, data) { return ({
    sucess: true,
    v: verb,
    d: data
}); };
exports.errorResponse = function (request, errorMessage) { return ({
    sucess: false,
    reqId: request.reqId,
    v: request.v,
    error: errorMessage
}); };
exports.randomSelect = function (arr) {
    var randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
};
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
exports.genRoomCode = function () {
    return lodash_1.range(0, 4)
        .map(function () { return exports.randomSelect(alphabet); })
        .join("");
};
exports.randomInt = function (max) {
    return Math.floor(Math.random() * max);
};
