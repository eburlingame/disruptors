import React, { useState } from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";

import { v4 as uuid } from "uuid";
import { sessionLoadingStateAtom, sessionStateAtom } from "../state/atoms";
import { useCommand, useProcessCommandReponse } from "./command";
import { loadPersistentSessionId, setPersistentSessionId } from "./persist";
import { useSocket } from "./socket";

const RETRY_DELAY = 2000;

export const useSessionState = () => useRecoilValue(sessionStateAtom);

export const useSessionLoadingState = () =>
  useRecoilValue(sessionLoadingStateAtom);

export const useSetupSession = () => {
  const socket = useSocket();

  const [retryTimeout, setRetryTimeout] = useState<null | number>(null);

  const [loadingState, setLoadingState] = useRecoilState(
    sessionLoadingStateAtom
  );

  // TODO: Handle errors when opening session
  const { sendCommand, loading, error } = useCommand();
  const processCommandResponse = useProcessCommandReponse();

  useEffect(() => {
    const openSession = async () => {
      if (socket.ws && !socket.isOpen) {
        console.log("Attempting to open websocket");

        try {
          /// Clear the retry timeout
          if (retryTimeout) {
            clearTimeout(retryTimeout);
            setRetryTimeout(null);
          }

          /// Attempt to open the websocket
          setLoadingState({ isOpen: false, isLoading: true });
          await socket.ws.open();
        } catch (e) {
          console.warn("Error opening websocket session: " + e.message);

          /// Schedule a reconnection
          console.log(`Will retry connection in ${RETRY_DELAY}ms`);
          setRetryTimeout(setTimeout(() => openSession(), RETRY_DELAY) as any);

          /// Indicate retry as "loading"
          setLoadingState({ isOpen: false, isLoading: true });

          return;
        }

        /// Check in local storage for an existing sessionId, and send it along
        let payload = {};
        const existingSessionId = loadPersistentSessionId();

        if (existingSessionId) {
          console.log(`Attempting to reopen session ${existingSessionId}`);
          payload = { sessionId: existingSessionId };
        }

        const result = await sendCommand("session.open", payload);

        if (result.sucess) {
          const { sessionId } = result.data;

          if (sessionId) {
            setPersistentSessionId(sessionId);
            await processCommandResponse(result);
            setLoadingState({ isOpen: true, isLoading: false });
          }
        }
      }
    };

    openSession();
  }, [socket]);
};

export const SessionBootstrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useSetupSession();

  const sessionState = useSessionState();
  useEffect(() => {
    console.log(sessionState);
  }, [sessionState]);

  return <>{children}</>;
};
