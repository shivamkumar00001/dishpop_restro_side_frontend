import { useEffect } from "react";
import { socket } from "../utils/socket";

export default function useLiveOrders(username, callback) {
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
      callback("created", order);
    };

    const onUpdated = (order) => {
      console.log("📥 SOCKET EVENT: updated", order);
      callback("updated", order);
    };

    console.log("🧲 Attaching socket listeners");

    // ✅ support BOTH contracts
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
  }, [username, callback]);
}
