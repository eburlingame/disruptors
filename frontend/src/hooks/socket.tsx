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

const WS_API_URL =
  process.env.NODE_ENV === "production"
    ? "wss://api.disruptors.ericburlingame.com"
    : "ws://localhost:8080/ws";

export type Socket = {
  ws: WebSocketAsPromised | null;
  isOpen: boolean;
};

const SocketContext = createContext<Socket>({
  ws: null,
  isOpen: false,
});

export const useSocket = () => useContext(SocketContext);

export const useSetupSocket = (): Socket => {
  const [isOpen, setIsOpen] = useState(false);

  const socket = useRef<WebSocketAsPromised | null>(null);
  const processCommandResponse = useProcessCommandReponse();

  useEffect(() => {
    socket.current = new WebSocketAsPromised(WS_API_URL, {
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (data: any) => JSON.parse(data),

      attachRequestId: (data, requestId) => ({ ...data, reqId: requestId }),
      extractRequestId: (data) => data && data.reqId,
    });

    /// Listen for ad-hoc messages
    socket.current.onUnpackedMessage.addListener((msg: object) => {
      if (!("reqId" in msg) && "v" in msg) {
        const command: AdhocResponse = msg as any;
        const result: SendCommandResult = { sucess: true, data: command.d };

        processCommandResponse(result);
      }
    });

    socket.current.onOpen.addListener(() => {
      console.log("Socket connection opened");
      setIsOpen(true);
    });

    socket.current.onClose.addListener(() => {
      console.log("Socket connection closed");
      setIsOpen(false);
    });
  }, []);

  return {
    ws: socket.current,
    isOpen,
  };
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
