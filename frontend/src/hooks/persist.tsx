const LOCAL_STORAGE_SESSION_KEY = "disruptors_session_id";

export const loadPersistentSessionId = (): string | null => {
  const value = window.localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);

  if (value) {
    return value;
  }

  return null;
};

export const setPersistentSessionId = (sessionId: string) => {
  window.localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, sessionId);
};

export const clearPersistentSessionId = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
};
