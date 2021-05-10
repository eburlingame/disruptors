import { useEffect, useRef } from "react";

import WebSocketAsPromised from "websocket-as-promised";
import { v4 as uuid } from "uuid";

const WS_API_URL = "ws://localhost:8080/ws";

export const useSocket = () => {
  const socket = useRef<WebSocketAsPromised | null>(null);

  useEffect(() => {
    socket.current = new WebSocketAsPromised(WS_API_URL, {
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (data: any) => JSON.parse(data),

      attachRequestId: (data, requestId) => ({ ...data, reqId: requestId }),
      extractRequestId: (data) => data && data.reqId,
    });
  }, []);

  return socket.current;
};
