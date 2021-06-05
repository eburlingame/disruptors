"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a, _b;
exports.__esModule = true;
exports.tilesTouchingVertex = exports.getCommonEdgeCoordinate = exports.vertexAdjacenies = exports.reciropcalEdges = exports.getCommonVertexCoordinate = exports.hasTileAlongEdge = exports.hasTile = exports.findTile = exports.tileAlongEdge = exports.edgeCoordinateEqual = exports.vertexCoordinateEqual = exports.vectorsEqual = exports.addVectors = exports.edgeVectors = exports.VertexDir = exports.EdgeDir = exports.locationToPosition = void 0;
exports.locationToPosition = function (_a) {
    var x = _a.x, y = _a.y, z = _a.z;
    return ({
        x: x - y,
        y: -z
    });
};
var EdgeDir;
(function (EdgeDir) {
    EdgeDir[EdgeDir["NE"] = 0] = "NE";
    EdgeDir[EdgeDir["E"] = 1] = "E";
    EdgeDir[EdgeDir["SE"] = 2] = "SE";
    EdgeDir[EdgeDir["SW"] = 3] = "SW";
    EdgeDir[EdgeDir["W"] = 4] = "W";
    EdgeDir[EdgeDir["NW"] = 5] = "NW";
})(EdgeDir = exports.EdgeDir || (exports.EdgeDir = {}));
var VertexDir;
(function (VertexDir) {
    VertexDir[VertexDir["N"] = 0] = "N";
    VertexDir[VertexDir["NE"] = 1] = "NE";
    VertexDir[VertexDir["SE"] = 2] = "SE";
    VertexDir[VertexDir["S"] = 3] = "S";
    VertexDir[VertexDir["SW"] = 4] = "SW";
    VertexDir[VertexDir["NW"] = 5] = "NW";
})(VertexDir = exports.VertexDir || (exports.VertexDir = {}));
exports.edgeVectors = [
    { x: 1, y: 0, z: -1 },
    { x: 1, y: -1, z: 0 },
    { x: 0, y: -1, z: 1 },
    { x: -1, y: 0, z: 1 },
    { x: -1, y: 1, z: 0 },
    { x: 0, y: 1, z: -1 },
];
exports.addVectors = function (a, b) { return ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
}); };
exports.vectorsEqual = function (a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
};
exports.vertexCoordinateEqual = function (a, b) { return exports.vectorsEqual(a.tile, b.tile) && a.vertexIndex === b.vertexIndex; };
exports.edgeCoordinateEqual = function (a, b) { return exports.vectorsEqual(a.tile, b.tile) && a.edgeIndex === b.edgeIndex; };
exports.tileAlongEdge = function (position, edgeIndex) {
    var delta = exports.edgeVectors[edgeIndex];
    return exports.addVectors(position, delta);
};
exports.findTile = function (tiles, position) {
    return tiles.find(function (_a) {
        var location = _a.location;
        return exports.vectorsEqual(location, position);
    });
};
exports.hasTile = function (tiles, position) {
    return !!exports.findTile(tiles, position);
};
exports.hasTileAlongEdge = function (tiles, tile, edgeIndex) { return exports.hasTile(tiles, exports.tileAlongEdge(tile, edgeIndex)); };
exports.getCommonVertexCoordinate = function (tiles, vertexCoord) {
    var tile = vertexCoord.tile, vertexIndex = vertexCoord.vertexIndex;
    /// The top and bottom vertex should use their own coordinate
    if (vertexIndex === VertexDir.N || vertexIndex === VertexDir.S) {
        return vertexCoord;
    }
    if (vertexIndex === VertexDir.NE) {
        if (exports.hasTileAlongEdge(tiles, tile, EdgeDir.NE)) {
            return {
                tile: exports.tileAlongEdge(tile, EdgeDir.NE),
                vertexIndex: VertexDir.S
            };
        }
    }
    if (vertexIndex === VertexDir.SE) {
        if (exports.hasTileAlongEdge(tiles, tile, EdgeDir.SE)) {
            return {
                tile: exports.tileAlongEdge(tile, EdgeDir.SE),
                vertexIndex: VertexDir.N
            };
        }
    }
    /// Let the squares to the left draw the left verticies, if they exist
    if (vertexIndex === VertexDir.SW) {
        if (exports.hasTileAlongEdge(tiles, tile, EdgeDir.SW)) {
            return {
                tile: exports.tileAlongEdge(tile, EdgeDir.SW),
                vertexIndex: VertexDir.N
            };
        }
        if (exports.hasTileAlongEdge(tiles, tile, EdgeDir.W)) {
            return {
                tile: exports.tileAlongEdge(tile, EdgeDir.W),
                vertexIndex: VertexDir.SE
            };
        }
    }
    if (vertexIndex === VertexDir.NW) {
        if (exports.hasTileAlongEdge(tiles, tile, EdgeDir.NW)) {
            return {
                tile: exports.tileAlongEdge(tile, EdgeDir.NW),
                vertexIndex: VertexDir.S
            };
        }
        if (exports.hasTileAlongEdge(tiles, tile, EdgeDir.W)) {
            return {
                tile: exports.tileAlongEdge(tile, EdgeDir.W),
                vertexIndex: VertexDir.NE
            };
        }
    }
    return vertexCoord;
};
exports.reciropcalEdges = (_a = {},
    _a[EdgeDir.NE] = EdgeDir.SW,
    _a[EdgeDir.E] = EdgeDir.W,
    _a[EdgeDir.SE] = EdgeDir.NW,
    _a[EdgeDir.SW] = EdgeDir.NE,
    _a[EdgeDir.SW] = EdgeDir.NE,
    _a[EdgeDir.W] = EdgeDir.E,
    _a[EdgeDir.NW] = EdgeDir.SE,
    _a);
exports.vertexAdjacenies = (_b = {},
    _b[VertexDir.N] = [EdgeDir.NW, EdgeDir.NE],
    _b[VertexDir.NE] = [EdgeDir.NE, EdgeDir.E],
    _b[VertexDir.SE] = [EdgeDir.E, EdgeDir.SE],
    _b[VertexDir.S] = [EdgeDir.SE, EdgeDir.SW],
    _b[VertexDir.SW] = [EdgeDir.SW, EdgeDir.W],
    _b[VertexDir.NW] = [EdgeDir.W, EdgeDir.NW],
    _b);
/// Since two tiles can touch each edge, decide which one should draw the vertex button/label
exports.getCommonEdgeCoordinate = function (tiles, edgeCoord) {
    var tile = edgeCoord.tile, edgeIndex = edgeCoord.edgeIndex;
    /// Always draw the right edges
    if (edgeIndex === EdgeDir.NE ||
        edgeIndex === EdgeDir.E ||
        edgeIndex === EdgeDir.SE) {
        return edgeCoord;
    }
    /// Only draw the left edges if there isn't a tile to the left
    else if (exports.hasTileAlongEdge(tiles, tile, edgeIndex)) {
        return {
            tile: exports.tileAlongEdge(tile, edgeIndex),
            edgeIndex: exports.reciropcalEdges[edgeIndex]
        };
    }
    return edgeCoord;
};
exports.tilesTouchingVertex = function (tiles, vertexCoord) {
    var common = exports.getCommonVertexCoordinate(tiles, vertexCoord);
    var commonTile = exports.findTile(tiles, common.tile);
    if (!commonTile)
        throw new Error("Invalid tile?");
    var edges = exports.vertexAdjacenies[common.vertexIndex];
    var otherTiles = edges
        .map(function (edgeIndex) { return exports.findTile(tiles, exports.tileAlongEdge(common.tile, edgeIndex)); })
        .filter(function (t) { return t !== undefined; });
    return __spreadArrays([commonTile], otherTiles);
};
