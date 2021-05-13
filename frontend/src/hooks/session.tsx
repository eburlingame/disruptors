import React from "react";
import { useEffect, createContext, useState, useContext } from "react";
import { useRecoilState } from "recoil";

import { v4 as uuid } from "uuid";
import { gameRoomAtom } from "../state/atoms";
import { loadPersistentSessionId, setPersistentSessionId } from "./persist";
import { useSocket } from "./socket";

export type Session = {
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string | null;
};

const defaultSession: Session = {
  isOpen: false,
  isLoading: true,
  sessionId: null,
};

const SessionContext = createContext<Session>(defaultSession);

export const useSession = () => useContext(SessionContext);

export const useSetupSession = () => {
  const socket = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<null | string>(null);

  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);

  useEffect(() => {
    const openSession = async () => {
      if (socket) {
        console.log("Opening websocket");
        await socket.open();

        /// Check in local storage for an existing sessionId, and send it along
        let payload = {};
        const existingSessionId = loadPersistentSessionId();

        if (existingSessionId) {
          console.log(`Attempting to reopen session ${existingSessionId}`);
          payload = { sessionId: existingSessionId };
        }

        const response = await socket.sendRequest(
          { v: "session.open", d: payload },
          { requestId: uuid() }
        );

        if (response) {
          const { sessionId, playerId, gameRoomCode } = response.d;

          if (sessionId) {
            console.log(`Session ${sessionId} open`);

            setPersistentSessionId(sessionId);
            setSessionId(sessionId);

            if (playerId && gameRoomCode) {
              setGameRoomState({ playerId, gameRoomCode });
            }

            setIsOpen(true);
          }
        }
      }
    };

    openSession();
  }, [socket]);

  return {
    isOpen,
    isLoading,
    sessionId,
  };
};

export const SessionBootstrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = useSetupSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
