import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./global.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ✅ Import offline services
import offlineDB from "./services/offlineDB";
import syncService from "./services/syncService";

// ✅ Initialize IndexedDB
offlineDB.init()
  .then(() => {
    console.log("✅ Offline database initialized");
  })
  .catch((error) => {
    console.error("❌ Offline database initialization failed:", error);
  });

// ✅ Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
        
        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.log("🆕 New version available! Please refresh.");
              // Optionally show update notification to user
            }
          });
        });
      })
      .catch((error) => {
        console.log("❌ Service Worker registration failed:", error);
      });
  });
}

// ✅ Initialize sync service
syncService.addListener((event) => {
  if (event.event === "sync_completed") {
    console.log(`✅ Sync completed: ${event.data.successCount} items synced`);
  } else if (event.event === "sync_failed") {
    console.error("❌ Sync failed:", event.data.error);
  }
});

// ✅ Auto-sync on network restore
window.addEventListener("online", () => {
  console.log("🌐 Connection restored - starting background sync");
  syncService.forceSyncNow();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);