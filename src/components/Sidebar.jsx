import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  Cog6ToothIcon,
  QrCodeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import { Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { username } = useParams();

  /* =========================
     AUTH DATA
  ========================= */
  const { owner, loading } = useAuth();

  const ownerName = loading ? "Loading..." : owner?.name || "Owner";
  const restaurantName = loading
    ? "Loading..."
    : owner?.restaurantName || "Restaurant";

  /* =========================
     INITIALS
  ========================= */
  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "R";

  const basePath = username ? `/${username}` : "";

  // ✅ ARRANGED BY PRIORITY (Most Used → Least Used)
  const menuItems = [
    // 🔥 CORE OPERATIONS (Daily Use)
    { label: "Dashboard", icon: HomeIcon, path: `${basePath}/dashboard` },
    {
      label: "Orders",
      icon: ClipboardDocumentListIcon,
      path: `${basePath}/orders`,
    },
    // {
    //   label: "Billing",
    //   icon: DocumentTextIcon,
    //   path: `${basePath}/billing`,
    // },

    // 📊 MANAGEMENT (Regular Use)
    { label: "Digital Menu", icon: CubeIcon, path: `${basePath}/dishes` },
    // {
    //   label: "Customer Analytics",
    //   icon: ChartBarIcon,
    //   path: `${basePath}/analytics`,
    // },

    // 📋 COMPLIANCE & REPORTING (Weekly/Monthly)
    // {
    //   label: "GST Audit",
    //   icon: ClipboardDocumentCheckIcon,
    //   path: `${basePath}/gst-audit`,
    // },

    // ⚙️ SETUP & CONFIGURATION (Occasional Use)
    // { label: "Get QR", icon: QrCodeIcon, path: `${basePath}/qr` },
    // { label: "Subscription", icon: BellIcon, path: `${basePath}/subscribe` },
    { label: "Settings", icon: Cog6ToothIcon, path: `/settings` },
  ];

  return (
    <aside
      className="
        w-16 sm:w-20 md:w-64
        bg-white
        h-screen
        flex flex-col
        sticky top-0 left-0
        z-50
        border-r border-gray-200
        overflow-y-auto
      "
    >
      {/* BRAND */}
      <div className="px-3 md:px-6 py-5 border-b border-gray-200">
        <h1 className="text-base md:text-xl font-bold tracking-tight text-gray-900">
          <span className="hidden md:inline">
            Dish<span className="text-blue-600">Pop</span>
          </span>
          <span className="md:hidden text-blue-600 text-center block font-bold">
            DP
          </span>
        </h1>
        <p className="text-xs text-gray-500 mt-1 hidden md:block">
          Restaurant Dashboard
        </p>
      </div>

      {/* MENU */}
      <nav className="px-2 md:px-3 py-4 flex-1">
        <ul className="space-y-1">
          {menuItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <li key={label}>
                <Link
                  to={path}
                  title={label}
                  className={`
                    flex items-center justify-center md:justify-start gap-3
                    px-2 md:px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      active
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden md:inline truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* FOOTER – OWNER & RESTAURANT */}
      <div className="p-2 md:p-4 border-t border-gray-200 mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 rounded-lg bg-gray-50 p-2 md:p-3 border border-gray-200">
          <div
            className="
              h-10 w-10 rounded-lg flex-shrink-0
              bg-gradient-to-br from-blue-500 to-blue-600
              flex items-center justify-center
              text-white font-semibold text-sm
              shadow-sm
            "
          >
            {getInitials(ownerName)}
          </div>

          <div className="min-w-0 flex-1 hidden md:block">
            <p className="truncate text-sm font-medium text-gray-900">
              {ownerName}
            </p>
            <p className="truncate text-xs text-gray-500">
              {restaurantName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
