import express from "express";
import Websocket from "ws";
import Socket from "./socket";
import Redis from "ioredis";
import PubSub from "./pubsub";

export type Context = {
  redis: Redis.Redis;
  pubsub: PubSub;
};

const API_PORT = parseInt(process.env.API_PORT || "8080");
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");
const REDIS_PASS = process.env.REDIS_PASSWORD || "redispass";

const main = async () => {
  const app = express();
  const redis = new Redis(REDIS_PORT, REDIS_HOST, { password: REDIS_PASS });

  /// Pubsub requires a separate redis connection
  const subscriberRedis = new Redis(REDIS_PORT, REDIS_HOST, {
    password: REDIS_PASS,
  });
  const pubsub = new PubSub(subscriberRedis);

  const context: Context = {
    redis,
    pubsub,
  };

  /// Setup WS server
  const wsServer = new Websocket.Server({ noServer: true });
  wsServer.on("connection", (socket: Websocket) => new Socket(context, socket));

  /// Setup HTTP server
  const server = app.listen(API_PORT);
  console.log(`Server listening on port ${API_PORT}`);

  /// Configure HTTP server upgrade (on any route)
  server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request);
    });
  });
};

main();
