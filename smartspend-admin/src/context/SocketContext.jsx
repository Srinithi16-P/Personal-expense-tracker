import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../api/axiosClient";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { admin, token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!admin || !token) return;

    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => socket.emit("register", admin._id));

    socket.on("new_feedback", () => {
      window.dispatchEvent(new CustomEvent("smartspend-admin:new_feedback"));
    });

    return () => socket.disconnect();
  }, [admin, token]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
