import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";

export default function useLiveOrders(username, callback) {
  const callbackRef = useRef(callback);

  // keep latest callback without retriggering socket effect
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    console.log("🟡 useLiveOrders effect triggered");
    console.log("➡️ username received:", username);

    if (!username) {
      console.log("⛔ No username, skipping socket join");
      return;
    }

    console.log("🔗 Emitting join-restaurant:", username);
    socket.emit("join-restaurant", username);

    const onCreated = (order) => {
      console.log("📥 SOCKET EVENT: created", order);
      callbackRef.current?.("created", order);
    };

    const onUpdated = (order) => {
      console.log("📥 SOCKET EVENT: updated", order);
      callbackRef.current?.("updated", order);
    };

    console.log("🧲 Attaching socket listeners");

    socket.on("order:created", onCreated);
    socket.on("order-created", onCreated);

    socket.on("order:updated", onUpdated);
    socket.on("order-updated", onUpdated);

    return () => {
      console.log("🧹 Cleaning up socket listeners for:", username);

      socket.off("order:created", onCreated);
      socket.off("order-created", onCreated);

      socket.off("order:updated", onUpdated);
      socket.off("order-updated", onUpdated);
    };
  }, [username]);
}
