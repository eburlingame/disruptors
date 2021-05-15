import React from "react";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import WebSocketAsPromised from "websocket-as-promised";
import {
  AdhocResponse,
  SendCommandResult,
  useProcessCommandReponse,
} from "./command";

const WS_API_URL = "ws://localhost:8080/ws";

export type Session = {
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string | null;
};

const SocketContext = createContext<WebSocketAsPromised | null>(null);

export const useSocket = () => useContext(SocketContext);

export const useSetupSocket = () => {
  const [socketId, setSocketId] = useState(0);
  const socket = useRef<WebSocketAsPromised | null>(null);
  const processCommandResponse = useProcessCommandReponse();

  useEffect(() => {
    socket.current = new WebSocketAsPromised(WS_API_URL, {
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (data: any) => JSON.parse(data),

      attachRequestId: (data, requestId) => ({ ...data, reqId: requestId }),
      extractRequestId: (data) => data && data.reqId,
    });

    /// Listen for ad-hoc messaged
    socket.current.onUnpackedMessage.addListener((msg: object) => {
      console.log(msg);

      if (!("reqId" in msg) && "v" in msg) {
        const command: AdhocResponse = msg as any;
        const result: SendCommandResult = { sucess: true, data: command.d };

        processCommandResponse(result);
      }
    });

    /// Increment the socketId counter to force a re-renders
    setSocketId((id) => id + 1);
  }, []);

  return socket.current;
};

export const SocketBootstrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = useSetupSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
