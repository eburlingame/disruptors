import Joi, { exist } from "joi";
import { Context } from "./";
import { BroadcastFn, Request, Response } from "./socket";
import { v4 as uuid } from "uuid";
import {
  adhocResponse,
  errorResponse,
  genRoomCode,
  sucessResponse,
} from "./util";
import Games from "./games";

import SessionPersistor, { PersistedSession } from "./persist/session";
import RoomPersistor, { PersistedRoom, RoomPlayer } from "./persist/room";

export type SessionState = {
  sessionId: string;
  you?: RoomPlayer;
  room?: PersistedRoom;
  game?: {
    state: any;
  };
};

export type HandlerFn = (
  request: Request,
  data: any
) => Promise<Response | null>;

export type CommandHandler = {
  schema: Joi.Schema;
  handler: HandlerFn;
};

export default class Handler {
  private context: Context;
  private broadcastFn: BroadcastFn;
  private handlerMap: { [key: string]: CommandHandler };

  private session: PersistedSession | null;

  private sessions;
  private rooms;

  constructor(context: Context, broadcastFn: BroadcastFn) {
    this.context = context;
    this.broadcastFn = broadcastFn;

    this.sessions = SessionPersistor(context);
    this.rooms = RoomPersistor(context);

    this.session = null;

    /// Handler function map
    this.handlerMap = {
      "session.open": {
        schema: Joi.object({ sessionId: Joi.string().optional() }),
        handler: this.openSession.bind(this),
      },
      "room.create": {
        schema: Joi.object({ roomName: Joi.string().allow("").optional() }),
        handler: this.createRoom.bind(this),
      },
      "room.join": {
        schema: Joi.object({ roomCode: Joi.string().required().length(4) }),
        handler: this.joinRoom.bind(this),
      },
      "room.leave": {
        schema: Joi.object({}),
        handler: this.leaveRoom.bind(this),
      },
    };
  }

  async handle(request: Request): Promise<Response | null> {
    console.log("Handling request: ", request);
    const { v: verb, d: data } = request;

    /// Find the handler associated with the given verb
    const commandHandler = this.handlerMap[verb];
    if (!commandHandler) {
      return errorResponse(request, `Unknown command ${verb}`);
    }

    const { schema, handler } = commandHandler;

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
      return handler(request, value);
    } catch (e) {
      console.warn(e);
      return errorResponse(request, e.message);
    }
  }

  /// Helper functions

  private async getSession(): Promise<PersistedSession> {
    if (this.session) {
      const latestSession = await this.sessions.getSession(
        this.session.sessionId
      );

      if (latestSession) {
        this.session = latestSession;
        return latestSession;
      }
    }

    throw new Error("Session has not been opened yet!");
  }

  private async putSession(session: PersistedSession): Promise<void> {
    await this.sessions.putSession(session);
    this.session = session;
  }

  private async commonState(): Promise<SessionState> {
    if (!this.session) throw new Error("Session not open!");

    let state: SessionState = {
      sessionId: this.session.sessionId,
    };

    if (this.session.roomCode) {
      const room = await this.rooms.getRoom(this.session.roomCode);

      if (room) {
        state.room = room;
      }
    }

    return state;
  }

  private emptySession(): PersistedSession {
    return {
      sessionId: uuid(),
    };
  }

  /// Pubsub callbacks
  private async onRoomUpdates(msg: string) {
    /// Send out the current state when the room has been updated
    console.log("Game room was updated externally");
    console.log(adhocResponse("room.updated", await this.commonState()));
    return this.broadcastFn(
      adhocResponse("room.updated", await this.commonState())
    );
  }

  /// Handler functions

  private async openSession(request: Request, data: { sessionId: string }) {
    /// Default to an empty session
    let session: PersistedSession = this.emptySession();

    if (data.sessionId) {
      const existingSession = await this.sessions.getSession(data.sessionId);

      /// If a session id is passed in and the session is valid, use it
      if (existingSession) {
        session = existingSession;
      }
    }

    /// Persist the session
    await this.putSession(session);

    /// Re-subscribe to room
    if (session.roomCode) {
      await this.rooms.subscribeToRoom(
        session.roomCode,
        session.sessionId,
        this.onRoomUpdates.bind(this)
      );
    }

    return sucessResponse(request, await this.commonState());
  }

  private async createRoom(request: Request, data: { roomName: string }) {
    /// Default to an empty session
    let session: PersistedSession = await this.getSession(); /// Persist the session

    const playerId = session.playerId || uuid();
    const roomCode = genRoomCode();
    const game = new Games.Catan();

    const room: PersistedRoom = {
      roomCode: roomCode,
      players: [{ playerId, name: "", isHost: true }],
      game: "Catan",
      gameConfig: game.newGameConfig(),
    };

    await this.rooms.putRoom(room);
    await this.rooms.subscribeToRoom(
      room.roomCode,
      session.sessionId,
      this.onRoomUpdates.bind(this)
    );

    session.playerId = playerId;
    session.roomCode = roomCode;
    await this.putSession(session);

    return sucessResponse(request, await this.commonState());
  }

  private async joinRoom(request: Request, { roomCode }: { roomCode: string }) {
    /// Default to an empty session
    let session = await this.getSession();
    const playerId = session.playerId || uuid();

    let room = await this.rooms.getRoom(roomCode);
    if (!room) throw new Error(`Could not find room: ${roomCode}`);

    /// Add the player to the room
    room.players = [...room.players, { playerId, name: "", isHost: false }];

    /// Put the room back and subscribe to future updates
    await this.rooms.putRoom(room);
    await this.rooms.subscribeToRoom(
      room.roomCode,
      session.sessionId,
      this.onRoomUpdates.bind(this)
    );

    session.playerId = playerId;
    session.roomCode = roomCode;
    await this.putSession(session);

    return sucessResponse(request, await this.commonState());
  }

  private async leaveRoom(request: Request, {}: {}) {
    /// Default to an empty session
    const session = await this.getSession();

    /// If we're not in a room, there's nothing to do
    if (!session.roomCode) {
      return sucessResponse(request, await this.commonState());
    }

    const room = await this.rooms.getRoom(session.roomCode);
    if (!room) throw new Error(`Unable to find room`);

    /// Remove the player from the room
    room.players = room.players.filter(
      (player) => player.playerId !== session.playerId
    );

    /// Put the room back and unsubscribe
    await this.rooms.putRoom(room);
    await this.rooms.unsubscribeFromRoom(room.roomCode, session.sessionId);

    /// Update the session and persist
    session.playerId = undefined;
    session.roomCode = undefined;
    await this.putSession(session);

    return sucessResponse(request, await this.commonState());
  }
}
