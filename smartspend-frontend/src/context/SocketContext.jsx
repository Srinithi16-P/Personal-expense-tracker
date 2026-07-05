import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../api/axiosClient";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    if (!user || !token) return;

    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register", user._id);
    });

    socket.on("notification", (payload) => {
      setLiveNotifications((prev) => [payload, ...prev].slice(0, 20));
    });

    socket.on("expense_added", () => {
     
      window.dispatchEvent(new CustomEvent("smartspend:expense_added"));
    });

    socket.on("feedback_status_updated", (payload) => {
      window.dispatchEvent(new CustomEvent("smartspend:feedback_status_updated", { detail: payload }));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token]);

  const clearLiveNotifications = () => setLiveNotifications([]);

  return (
    <SocketContext.Provider value={{ liveNotifications, clearLiveNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
