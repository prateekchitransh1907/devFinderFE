import io from "socket.io-client";
import { SOCKET_URL } from "../api/endpoints";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    console.log("Connecting to local socket server...");
    return io(SOCKET_URL, {
      withCredentials: true,
    });
  } else {
    console.log("Connecting to production socket server...");
    return io("/", {
      withCredentials: true,
      path: "/api/socket.io",
    });
  }
};
