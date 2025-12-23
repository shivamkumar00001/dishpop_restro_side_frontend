import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const useLiveOrders = (username, onOrderEvent) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const initializeSocket = useCallback(() => {
    if (!username) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const token = localStorage.getItem("token");

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join:restaurant", username);
    });

    socket.on("joined", (data) => {
      console.log("✅ Joined room:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);

      if (reason === "io server disconnect") {
        reconnectTimeoutRef.current = setTimeout(() => {
          socket.connect();
        }, 1000);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("order:created", (data) => {
      console.log("📦 New order received:", data);
      if (onOrderEvent) {
        onOrderEvent("created", data.order);
      }
    });

    socket.on("order:updated", (data) => {
      console.log("🔄 Order updated:", data);
      if (onOrderEvent) {
        onOrderEvent("updated", data.order);
      }
    });

    socket.on("order:deleted", (data) => {
      console.log("🗑️ Order deleted:", data);
      if (onOrderEvent) {
        onOrderEvent("deleted", data.orderId);
      }
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping");
      }
    }, 30000);

    socket.on("pong", (data) => {
      console.log("🏓 Pong received:", data.timestamp);
    });

    socket.pingInterval = pingInterval;
  }, [username, onOrderEvent]);

  useEffect(() => {
    initializeSocket();

    return () => {
      if (socketRef.current) {
        if (socketRef.current.pingInterval) {
          clearInterval(socketRef.current.pingInterval);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [initializeSocket]);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    } else {
      initializeSocket();
    }
  }, [initializeSocket]);

  const isConnected = useCallback(() => {
    return socketRef.current?.connected || false;
  }, []);

  return {
    socket: socketRef.current,
    reconnect,
    isConnected,
  };
};

export default useLiveOrders;