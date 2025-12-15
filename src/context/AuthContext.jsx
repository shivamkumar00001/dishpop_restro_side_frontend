import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);

  // Fetch logged-in owner details
  useEffect(() => {
    async function fetchOwner() {
      try {
        const res = await api.get("/auth/me"); // your backend route
        setOwner(res.data.user);
      } catch (err) {
        console.log("Not logged in");
      }
    }
    fetchOwner();
  }, []);

  return (
    <AuthContext.Provider value={{ owner, setOwner }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
