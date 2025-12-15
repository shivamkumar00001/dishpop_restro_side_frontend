// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import logo from "../assets/logo.svg";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/profile"); 
        setUser(data.user);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };
    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-black text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-bold tracking-wide">DineAr</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/dashboard" className="hover:text-yellow-500 transition">
            Dashboard
          </Link>
          <Link to="/menu" className="hover:text-yellow-500 transition">
            Menu
          </Link>
          <Link to="/orders" className="hover:text-yellow-500 transition">
            Orders
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 hover:text-yellow-500 transition"
            >
              {user?.photo ? (
                <img
                  src={`http://localhost:5001${user.photo}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-black font-bold">
                  {user?.ownerName?.[0] || "U"}
                </div>
              )}
              <ChevronDown size={16} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-black border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-white/10"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/profile/edit");
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-white/10"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 hover:bg-red-600/40 text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black mt-4 space-y-4 p-4 border-t border-white/10">
          <Link to="/dashboard" className="block hover:text-yellow-400 transition">
            Dashboard
          </Link>
          <Link to="/menu" className="block hover:text-yellow-400 transition">
            Menu
          </Link>
          <Link to="/orders" className="block hover:text-yellow-400 transition">
            Orders
          </Link>

          {/* Mobile Profile Menu */}
          <div className="border-t border-white/10 pt-2">
            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left py-2 hover:text-yellow-400"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate("/profile/edit")}
              className="block w-full text-left py-2 hover:text-yellow-400"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-red-400 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
