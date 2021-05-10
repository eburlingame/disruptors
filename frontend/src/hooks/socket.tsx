import { useEffect, useMemo, useRef, useState } from "react";

import WebSocketAsPromised from "websocket-as-promised";
import { v4 as uuid } from "uuid";

const WS_API_URL = "ws://localhost:8080/ws";

export const useSocket = () => {
  const [socketId, setSocketId] = useState(0);
  const socket = useRef<WebSocketAsPromised | null>(null);

  useEffect(() => {
    socket.current = new WebSocketAsPromised(WS_API_URL, {
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (data: any) => JSON.parse(data),

      attachRequestId: (data, requestId) => ({ ...data, reqId: requestId }),
      extractRequestId: (data) => data && data.reqId,
    });

    /// Increment the socketId counter to force a re-renders
    setSocketId((id) => id + 1);
  }, []);

  return socket.current;
};
