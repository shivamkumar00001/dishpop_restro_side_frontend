import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setOwner(data.user);
      } catch (err) {
        // ✅ 401 is NORMAL when not logged in
        if (err.response?.status !== 401) {
          console.error("Auth check failed:", err);
        }
        setOwner(null);
      } finally {
        setLoading(false); // 🔥 always stop loading
      }
    };

    fetchOwner();
  }, []);

  return (
    <AuthContext.Provider value={{ owner, setOwner, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
