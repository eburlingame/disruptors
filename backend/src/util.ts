import { random, range } from "lodash";
import { Response, Request, AdhocResponse } from "./socket";

export const sucessResponse = (request: Request, data: any): Response => ({
  sucess: true,
  reqId: request.reqId,
  v: request.v,
  d: data,
});

export const adhocResponse = (verb: string, data: any): AdhocResponse => ({
  sucess: true,
  v: verb,
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

export const randomSelect = <T>(arr: T[]): T => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const genRoomCode = (): string => {
  return range(0, 4)
    .map(() => randomSelect(alphabet))
    .join("");
};

export const randomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};
