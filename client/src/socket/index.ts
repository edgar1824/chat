import { io } from "socket.io-client";

const URL = process.env.REACT_APP_CHAT_SOCKET_URL;
export const socket = io(URL!, {
  transports: ["polling", "websocket"],
  autoConnect: false,
});
