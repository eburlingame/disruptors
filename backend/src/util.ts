import { Response, Request } from "./socket";

export const sucessResponse = (request: Request, data: any): Response => ({
  sucess: true,
  reqId: request.reqId,
  v: request.v,
  d: data,
});

export const errorResponse = (
  request: Request,
  errorMessage: string
): Response => ({
  sucess: false,
  reqId: request.reqId,
  v: request.v,
  error: errorMessage,
});
