import Joi, { exist } from "joi";
import { Context } from "./";
import { Request, Response } from "./socket";
import { v4 as uuid } from "uuid";
import { errorResponse, sucessResponse } from "./util";

import SessionPersistor, { PersistedSession } from "./persist/session";
import RoomPersistor, { PersistedRoom, RoomPlayer } from "./persist/room";

export type Handler = (request: Request) => Promise<Response | null>;

export type CommandHandlerFn = (
  request: Request,
  data: any
) => Promise<Response | null>;

export type CommandHandler = {
  schema: Joi.Schema;
  handle: CommandHandlerFn;
};

export type HandlerMap = { [key: string]: CommandHandler };

export type SessionState = {
  sessionId: string;
  you?: RoomPlayer;
  room?: PersistedRoom;
  game?: {
    state: any;
  };
};

const handlerMap = (context: Context): HandlerMap => {
  const sessions = SessionPersistor(context);
  const rooms = RoomPersistor(context);

  /// Helper functions

  const commonState = async (
    session: PersistedSession
  ): Promise<SessionState> => {
    let state: SessionState = {
      sessionId: session.sessionId,
    };

    if (session.roomCode) {
      const room = await rooms.getRoom(session.roomCode);

      if (room) {
        state.room = room;
      }
    }

    return state;
  };

  const emptySession = (): PersistedSession => ({
    sessionId: uuid(),
  });

  return {
    /// Open a session and return the latest state
    "session.open": {
      schema: Joi.object({
        sessionId: Joi.string().optional(),
      }),
      handle: async (request: Request, data: { sessionId: string }) => {
        /// Default to an empty session
        let session: PersistedSession = emptySession();

        if (data.sessionId) {
          const existingSession = await sessions.getSession(data.sessionId);

          /// If a session id is passed in and the session is valid, use it
          if (existingSession) {
            session = existingSession;
          }
        }

        /// Persist the session
        await sessions.putSession(session);

        return sucessResponse(request, await commonState(session));
      },
    },
  };
};

export default (context: Context): Handler => {
  const handlers = handlerMap(context);

  return async (request: Request): Promise<Response | null> => {
    console.log("Handling request: ", request);
    const { v: verb, d: data } = request;

    /// Find the handler associated with the given verb
    const commandHandler = handlers[verb];
    if (!commandHandler) {
      return errorResponse(request, `Unknown command ${verb}`);
    }

    const { schema, handle } = commandHandler;

    /// Validate the Joi schema for the data field
    const { value, error } = schema.validate(data);
    if (error) {
      return errorResponse(
        request,
        `Invalid data command data provided: ${error.message}`
      );
    }

    /// Finally, call the handler function and return its response
    try {
      return handle(request, value);
    } catch (e) {
      return errorResponse(request, e.message);
    }
  };
};
