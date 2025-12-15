import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { autoUnlockSound } from "./utils/playSound";

function App() {

  // 🔓 AUTO-UNLOCK SOUND ON FIRST USER INTERACTION (PRO LEVEL)
  useEffect(() => {
    const unlock = () => {
      autoUnlockSound();

      // Remove listeners after first interaction
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
