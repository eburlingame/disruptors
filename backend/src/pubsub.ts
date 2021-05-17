import { Redis } from "ioredis";

export type PubSubCallback = (msg: string) => Promise<void>;

/* This is a basic wrapper around the Redis PubSub functionality. It is responsible for subscribing and unsubscribing to the 
   room/game channels.
  
   Since multiple sessions may need to listen to a room or a game, we maintain a Map of ChannelId -> SessionId -> Callback function
*/
export default class PubSub {
  private redis: Redis;
  private callbacks: Map<string, Map<string, PubSubCallback>>; // Maps channel id to a map of sessionId -> callback functions

  constructor(redis: Redis) {
    this.redis = redis;
    this.callbacks = new Map();

    this.redis.on("message", this.onMessage.bind(this));
  }

  private async onMessage(channel: string, msg: string) {
    const callbacks = this.callbacks.get(channel);

    if (callbacks) {
      await Promise.all(
        Array.from(callbacks.values()).map((callback) => callback(msg))
      );
    }
  }

  async subscribe(
    channel: string,
    key: string,
    cb: PubSubCallback
  ): Promise<boolean> {
    const result = await this.redis.subscribe(channel);

    if (result > 0) {
      const currentCallbacks = this.callbacks.get(channel);

      if (currentCallbacks) {
        currentCallbacks.set(key, cb);
      } else {
        const newCallbacks = new Map();
        newCallbacks.set(key, cb);
        this.callbacks.set(channel, newCallbacks);
      }

      return true;
    }

    throw new Error("Unable to subscribe to channel");
  }

  async unsubscribe(channel: string, key: string): Promise<boolean> {
    const callbacks = this.callbacks.get(channel);

    if (callbacks) {
      callbacks.delete(key);

      if (callbacks.size === 0) {
        this.callbacks.delete(channel);
        await this.redis.unsubscribe(channel);
      }
    }
    return true;
  }
}
