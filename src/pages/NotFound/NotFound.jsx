// // src/pages/NotFound/NotFound.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// export default function NotFound() {
//   return (
//     <div style={{
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//       textAlign: "center",
//       backgroundColor: "#f5f5f5",
//       color: "#333",
//       fontFamily: "Arial, sans-serif",
//     }}>
//       <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
//       <h2 style={{ margin: "20px 0" }}>Page Not Found</h2>
//       <p>The page you are looking for does not exist.</p>
//       <Link to="/" style={{
//         marginTop: "20px",
//         padding: "10px 20px",
//         backgroundColor: "#007bff",
//         color: "#fff",
//         borderRadius: "5px",
//         textDecoration: "none"
//       }}>Go Home</Link>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function NotFound() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        if (data?.user?.username) {
          setUsername(data.user.username);
        }
      } catch {
        setUsername(null);
      }
    };
    checkSession();
  }, []);

  const handleGoBack = () => {
    if (username) {
      navigate(`/${username}/dashboard`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090B10] text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-400 mt-2">Page not found</p>

      <button
        onClick={handleGoBack}
        className="mt-6 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 transition"
      >
        Go to Safe Page
      </button>
    </div>
  );
}
