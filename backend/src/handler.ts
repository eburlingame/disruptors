import Joi from "joi";
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
import RoomPersistor, {
  PersistedRoom,
  RoomPhase,
  RoomPlayer,
} from "./persist/room";
import games from "./games";

export type SessionState = {
  sessionId: string;
  you?: RoomPlayer;
  room?: PersistedRoom;
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
      "player.configure": {
        schema: Joi.object({
          name: Joi.string().required(),
        }),
        handler: this.configurePlayer.bind(this),
      },
      "game.configure": {
        schema: Joi.object({
          config: Joi.object().required(),
        }),
        handler: this.configureGame.bind(this),
      },
      "game.start": {
        schema: Joi.object({}),
        handler: this.startGame.bind(this),
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
      const result = await handler(request, value);
      return result;
    } catch (e) {
      console.warn(e);
      return errorResponse(request, e.message);
    }
  }

  async onClose(): Promise<void> {
    if (this.session) {
      const session = await this.sessions.getSession(this.session.sessionId);

      if (session && session.roomCode) {
        this.rooms.unsubscribeFromRoom(session.roomCode, session.sessionId);
      }
    }
  }

  /// Helper functions

  private async getCurrentSession(): Promise<PersistedSession> {
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

  private async putCurrentSession(session: PersistedSession): Promise<void> {
    await this.sessions.putSession(session);
    this.session = session;
  }

  private async getCurrentRoom(): Promise<{
    session: PersistedSession;
    room: PersistedRoom;
  }> {
    /// Default to an empty session
    const session = await this.getCurrentSession();

    if (!session.roomCode) {
      throw new Error(`Not in a room`);
    }

    const room = await this.rooms.getRoom(session.roomCode);
    if (!room) {
      throw new Error(`Could not find room: ${session.roomCode}`);
    }

    return { session, room };
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

        if (this.session.playerId) {
          const you = room.players.find(
            ({ playerId }) => playerId === this.session?.playerId
          );

          state.you = you;
        }
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
    await this.putCurrentSession(session);

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
    let session: PersistedSession = await this.getCurrentSession(); /// Persist the session

    const playerId = session.playerId || uuid();
    const roomCode = genRoomCode();
    const game = new Games.Catan();

    const initialPlayers = [{ playerId, name: "", isHost: true }];
    const intialConfig = game.newGameConfig();
    const isGameReady = game.readyToStart(initialPlayers, intialConfig);

    const room: PersistedRoom = {
      roomCode: roomCode,
      players: initialPlayers,
      phase: RoomPhase.OPENED,
      game: "Catan",
      gameConfig: intialConfig,
      gameReady: isGameReady,
    };

    await this.rooms.putRoom(room);
    await this.rooms.subscribeToRoom(
      room.roomCode,
      session.sessionId,
      this.onRoomUpdates.bind(this)
    );

    session.playerId = playerId;
    session.roomCode = roomCode;
    await this.putCurrentSession(session);

    return sucessResponse(request, await this.commonState());
  }

  private async joinRoom(request: Request, { roomCode }: { roomCode: string }) {
    /// Default to an empty session
    let session = await this.getCurrentSession();
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

    /// Update the game configuration
    const game = new games.Catan();
    room.gameConfig = game.updateGameConfig(room.players, room.gameConfig);
    room.gameReady = game.readyToStart(room.players, room.gameConfig);

    /// Update the current session
    session.playerId = playerId;
    session.roomCode = roomCode;
    await this.putCurrentSession(session);

    return sucessResponse(request, await this.commonState());
  }

  private async leaveRoom(request: Request, {}: {}) {
    /// Default to an empty session
    const session = await this.getCurrentSession();

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

    /// Update the game configuration
    const game = new games.Catan();
    room.gameConfig = game.updateGameConfig(room.players, room.gameConfig);
    room.gameReady = game.readyToStart(room.players, room.gameConfig);

    /// Put the room back and unsubscribe
    await this.rooms.putRoom(room);
    await this.rooms.unsubscribeFromRoom(room.roomCode, session.sessionId);

    /// Update the session and persist
    session.playerId = undefined;
    session.roomCode = undefined;
    await this.putCurrentSession(session);

    return sucessResponse(request, await this.commonState());
  }

  private async configurePlayer(request: Request, { name }: { name: string }) {
    /// Default to an empty session
    let session = await this.getCurrentSession();
    const playerId = session.playerId || uuid();

    if (!session.roomCode) {
      throw new Error(`Not in a room`);
    }

    let room = await this.rooms.getRoom(session.roomCode);
    if (!room) {
      throw new Error(`Could not find room: ${session.roomCode}`);
    }

    /// Change the players name
    room.players = room.players.map((player) => {
      if (player.playerId === session.playerId) {
        return { ...player, name };
      }
      return player;
    });

    /// Persist the room and the session
    await this.rooms.putRoom(room);

    return sucessResponse(request, await this.commonState());
  }

  private async configureGame(request: Request, { config }: { config: any }) {
    let { session, room } = await this.getCurrentRoom();

    const player = room.players.find(
      ({ playerId }) => playerId === session.playerId
    );
    if (!player) {
      throw new Error(`Invalid player`);
    }

    /// Update the game configuration
    const game = new Games.Catan();
    room.gameConfig = game.updateGameConfig(room.players, config);
    room.gameReady = game.readyToStart(room.players, room.gameConfig);

    /// Persist the room and the session
    await this.rooms.putRoom(room);

    return sucessResponse(request, await this.commonState());
  }

  private async startGame(request: Request, {}: {}) {
    let { session, room } = await this.getCurrentRoom();

    const player = room.players.find(
      ({ playerId }) => playerId === session.playerId
    );

    if (!player || !player.isHost) {
      throw new Error("Only the host can start the game");
    }

    /// Update the game configuration
    const game = new Games.Catan();

    const isReadyToStart = game.readyToStart(room.players, room.gameConfig);

    if (!isReadyToStart) {
      throw new Error("Game isn't ready to start");
    }

    /// Start the initial game
    const initialGameState = game.startGame(room.players, room.gameConfig);

    room.gameState = {
      state: initialGameState,
      actions: [],
    };

    room.phase = RoomPhase.PLAYING;

    /// Persist the room and the session
    await this.rooms.putRoom(room);

    return sucessResponse(request, await this.commonState());
  }
}
