import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  XMarkIcon,
  Cog6ToothIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { username } = useParams();
  const location = useLocation();

  const { owner } = useAuth() || {};
  const ownerName = owner?.ownerName ?? "Restaurant";

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "R";

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("openSidebar", handler);
    return () => document.removeEventListener("openSidebar", handler);
  }, []);

  const basePath = username ? `/${username}` : "";

  const menuItems = [
    { label: "Dashboard", icon: HomeIcon, path: `${basePath}/dashboard` },
    { label: "Digital Menu", icon: CubeIcon, path: `${basePath}/dishes` },
    { label: "Orders", icon: ClipboardDocumentListIcon, path: `${basePath}/orders` },
    { label: "Get QR", icon: QrCodeIcon, path: `${basePath}/qr` },
    { label: "Subscribe", icon: BellIcon, path: `${basePath}/subscribe` },
    { label: "Settings", icon: Cog6ToothIcon, path: `/settings` },
  ];

  return (
    <>
      <aside
        className={`
          w-64 bg-[#11151c]
          min-h-[100vh] h-auto
          flex flex-col

          fixed lg:sticky top-0 left-0
          z-50

          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Mobile Close */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden self-end p-4 text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* MENU */}
        <nav className="px-3 py-2">
          <ul className="space-y-2">
            {menuItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <li key={label}>
                  <Link
                    to={path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors
                      ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-[#293042]"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="mt-auto p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#293042] p-3">
            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {getInitials(ownerName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {ownerName}
              </p>
              <p className="text-xs text-gray-400">Restaurant Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
