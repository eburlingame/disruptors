import express from "express";
import Websocket from "ws";
import Socket from "./socket";
import Redis from "ioredis";

export type Context = {
  redis: Redis.Redis;
};

const API_PORT = parseInt(process.env.API_PORT || "8080");
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");
const REDIS_PASS = process.env.REDIS_PASSWORD || "redispass";

const main = async () => {
  const app = express();
  const redis = new Redis(REDIS_PORT, REDIS_HOST, { password: REDIS_PASS });

  const context = {
    redis,
  };

  const wsServer = new Websocket.Server({ noServer: true });

  wsServer.on("connection", (socket: Websocket) => new Socket(context, socket));

  const server = app.listen(API_PORT);
  console.log(`Server listening on port ${API_PORT}`);

  server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request);
    });
  });
};

main();
