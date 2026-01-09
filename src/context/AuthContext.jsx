// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../services/api";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [owner, setOwner] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOwner = async () => {
//       try {
//         const { data } = await api.get("/auth/me", {
//           withCredentials: true, // 🔥 important for cookies
//         });

//         // ✅ normalize response
//         setOwner(data.user || data.owner || null);
//       } catch (err) {
//         if (err.response?.status !== 401) {
//           console.error("Auth check failed:", err);
//         }
//         setOwner(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwner();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ owner, setOwner, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/register",
      "/forgot-password",
    ];

    // 🚫 Do NOT check auth on public routes
    if (publicRoutes.includes(window.location.pathname)) {
      setLoading(false);
      return;
    }

    const fetchOwner = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setOwner(data.user || null);
      } catch (error) {
        // user not logged in or token expired
        setOwner(null);
      } finally {
        setLoading(false);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
