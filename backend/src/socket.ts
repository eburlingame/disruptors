import Websocket from "ws";
import Joi from "joi";
import { Context } from "./index";
import Handler from "./handler";

export type Request = {
  reqId: string;
  v: string;
  d: string;
};

export const requestSchema = Joi.object({
  reqId: Joi.string().required().min(1),
  v: Joi.string().required().min(1),
  d: Joi.any().optional(),
});

export type ParseError = {
  sucess: false;
  error: string;
};

/// Responses are send after a request is received
export type Response =
  | {
      sucess: true;
      reqId: string;
      v: string;
      d: string;
    }
  | {
      sucess: false;
      reqId: string;
      v: string;
      error: string;
    };

/// Ad-hoc repsonses can be sent any time to update the client
export type AdhocResponse = {
  sucess: true;
  v: string;
  d: string;
};

export type BroadcastFn = (payload: object) => Promise<void>;

export default class Socket {
  private socket: Websocket;
  private handler: Handler;

  constructor(context: Context, ws: Websocket) {
    this.socket = ws;
    this.handler = new Handler(context, this.broadcast.bind(this));

    ws.on("message", this.onMessage.bind(this));
    ws.on("error", this.onError.bind(this));
    ws.on("close", this.onClose.bind(this));
  }

  async onOpen() {
    console.log("Websocket connection opened");
  }

  async sendMessage(message: object) {
    const payload = JSON.stringify(message);
    this.socket.send(payload);
  }

  async sendParseError(error: ParseError) {
    return this.sendMessage(error);
  }

  async sendResponse(response: Response) {
    return this.sendMessage(response);
  }

  async broadcast(payload: object) {
    return this.sendMessage(payload);
  }

  async onMessage(message: string) {
    const request = JSON.parse(message);
    const { value, error } = requestSchema.validate(request);

    if (error) {
      return this.sendParseError({ sucess: false, error: error.message });
    }

    const handlerResult = await this.handler.handle(value);

    if (handlerResult) {
      this.sendResponse(handlerResult);
    }
  }

  async onError(e: any) {}

  async onClose() {}
}
