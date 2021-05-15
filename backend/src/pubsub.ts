import { Redis } from "ioredis";

export type PubSubCallback = (msg: string) => Promise<void>;

export default class PubSub {
  private redis: Redis;
  private callbacks: Map<string, Map<string, PubSubCallback>>;

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
    await this.redis.unsubscribe(channel);
    const callbacks = this.callbacks.get(channel);

    if (callbacks) {
      callbacks.delete(key);

      if (callbacks.size === 0) {
        this.callbacks.delete(channel);
      }
    }

    return true;
  }
}
