import { Context } from "src";

export type PersistedSession = {
  sessionId: string;
  playerId?: string;
  roomCode?: string;
};

const SESSION_PREFIX = "session|";

export default (context: Context) => {
  const { redis } = context;

  const sessionKey = (sessionId: string) => SESSION_PREFIX + sessionId;

  const putSession = async (session: PersistedSession) => {
    await redis.set(sessionKey(session.sessionId), JSON.stringify(session));
  };

  const getSession = async (
    sessionId: string
  ): Promise<PersistedSession | null> => {
    const response = await redis.get(sessionKey(sessionId));

    if (response) {
      const session: PersistedSession = JSON.parse(response);
      return session;
    }

    return null;
  };

  const deleteSession = async (session: PersistedSession) => {
    return redis.del(sessionKey(session.sessionId));
  };

  return { putSession, getSession, deleteSession };
};
