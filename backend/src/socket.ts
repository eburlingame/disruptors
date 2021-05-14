import Websocket from "ws";
import Joi from "joi";
import { Context } from "./index";
import CommandHandler, { Handler } from "./handler";

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

export default class Socket {
  private socket: Websocket;
  private handler: Handler;

  constructor(context: Context, ws: Websocket) {
    this.socket = ws;
    this.handler = CommandHandler(context);

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

  async onMessage(message: string) {
    const request = JSON.parse(message);
    const { value, error } = requestSchema.validate(request);

    if (error) {
      return this.sendParseError({ sucess: false, error: error.message });
    }

    const handlerResult = await this.handler(value);

    if (handlerResult) {
      this.sendResponse(handlerResult);
    }
  }

  async onError(e: any) {}

  async onClose() {}
}
