// import {
//   HomeIcon,
//   CubeIcon,
//   ClipboardDocumentListIcon,
//   BellIcon,
//   XMarkIcon,
//   Cog6ToothIcon,
//   QrCodeIcon,
// } from "@heroicons/react/24/outline";
// import { useEffect, useState } from "react";
// import { Link, useParams, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);
//   const location = useLocation();
//   const { username } = useParams();

//   /* =========================
//      AUTH DATA
//   ========================= */
//   const { owner, loading } = useAuth();

//   const ownerName = loading
//     ? "Loading..."
//     : owner?.name || "Owner";

//   const restaurantName = loading
//     ? "Loading..."
//     : owner?.restaurantName || "Restaurant";

//   /* =========================
//      INITIALS
//   ========================= */
//   const getInitials = (name = "") =>
//     name
//       .split(" ")
//       .filter(Boolean)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase() || "R";

//   /* =========================
//      MOBILE SIDEBAR OPEN
//   ========================= */
//   useEffect(() => {
//     const handler = () => setOpen(true);
//     document.addEventListener("openSidebar", handler);
//     return () => document.removeEventListener("openSidebar", handler);
//   }, []);

//   const basePath = username ? `/${username}` : "";

//   const menuItems = [
//     { label: "Dashboard", icon: HomeIcon, path: `${basePath}/dashboard` },
//     { label: "Digital Menu", icon: CubeIcon, path: `${basePath}/dishes` },
//     { label: "Orders", icon: ClipboardDocumentListIcon, path: `${basePath}/orders` },
//     { label: "Get QR", icon: QrCodeIcon, path: `${basePath}/qr` },
//     { label: "Subscription", icon: BellIcon, path: `${basePath}/subscribe` },
//     { label: "Settings", icon: Cog6ToothIcon, path: `/settings` },
//   ];

//   return (
//     <>
//       <aside
//         className={`
//           w-64 bg-[#0d1117]
//           min-h-screen
//           flex flex-col
//           fixed lg:sticky top-0 left-0
//           z-50
//           border-r border-white/10
//           transition-transform duration-300 ease-in-out
//           ${open ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//         `}
//       >
//         {/* MOBILE CLOSE */}
//         <button
//           onClick={() => setOpen(false)}
//           className="lg:hidden self-end p-4 text-gray-300 hover:text-white"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* BRAND */}
//         <div className="px-6 py-5 border-b border-white/10">
//           <h1 className="text-xl font-semibold tracking-tight text-white">
//             Dish<span className="text-cyan-400">Pop</span>
//           </h1>
//           <p className="text-xs text-gray-400 mt-1">
//             Restaurant Dashboard
//           </p>
//         </div>

//         {/* MENU */}
//         <nav className="px-3 py-4 flex-1">
//           <ul className="space-y-1">
//             {menuItems.map(({ label, icon: Icon, path }) => {
//               const active = location.pathname === path;
//               return (
//                 <li key={label}>
//                   <Link
//                     to={path}
//                     onClick={() => setOpen(false)}
//                     className={`
//                       flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
//                       transition-all duration-200
//                       ${
//                         active
//                           ? "bg-cyan-500/15 text-cyan-400 shadow-inner"
//                           : "text-gray-300 hover:bg-white/5 hover:text-white"
//                       }
//                     `}
//                   >
//                     <Icon className="w-5 h-5" />
//                     {label}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* FOOTER – OWNER & RESTAURANT */}
//         <div className="p-4 border-t border-white/10">
//           <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 backdrop-blur-md">
//             <div
//               className="
//                 h-10 w-10 rounded-xl
//                 bg-gradient-to-br from-cyan-500 to-blue-600
//                 flex items-center justify-center
//                 text-white font-semibold
//                 shadow-lg
//               "
//             >
//               {getInitials(ownerName)}
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-sm font-medium text-white">
//                 {ownerName}
//               </p>
//               <p className="truncate text-xs text-gray-400">
//                 {restaurantName}
//               </p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* MOBILE OVERLAY */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </>
//   );
// }



import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  Cog6ToothIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { username } = useParams();

  /* =========================
     AUTH DATA
  ========================= */
  const { owner, loading } = useAuth();

  const ownerName = loading
    ? "Loading..."
    : owner?.name || "Owner";

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

  const menuItems = [
    { label: "Dashboard", icon: HomeIcon, path: `${basePath}/dashboard` },
    { label: "Digital Menu", icon: CubeIcon, path: `${basePath}/dishes` },
    { label: "Orders", icon: ClipboardDocumentListIcon, path: `${basePath}/orders` },
    { label: "Get QR", icon: QrCodeIcon, path: `${basePath}/qr` },
    { label: "Subscription", icon: BellIcon, path: `${basePath}/subscribe` },
    { label: "Settings", icon: Cog6ToothIcon, path: `/settings` },
  ];

  return (
    <aside
      className="
        w-16 sm:w-20 md:w-64
        bg-[#0d1117]
        h-screen
        flex flex-col
        sticky top-0 left-0
        z-50
        border-r border-white/10
        overflow-y-auto
      "
    >
      {/* BRAND */}
      <div className="px-3 md:px-6 py-5 border-b border-white/10">
        <h1 className="text-base md:text-xl font-semibold tracking-tight text-white">
          <span className="hidden md:inline">
            Dish<span className="text-cyan-400">Pop</span>
          </span>
          <span className="md:hidden text-cyan-400 text-center block">DP</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1 hidden md:block">
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
                  className={`
                    flex items-center justify-center md:justify-start gap-3 
                    px-2 md:px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${
                      active
                        ? "bg-cyan-500/15 text-cyan-400 shadow-inner"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                  title={label}
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
      <div className="p-2 md:p-4 border-t border-white/10 mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 rounded-xl bg-white/5 p-2 md:p-3 backdrop-blur-md">
          <div
            className="
              h-10 w-10 rounded-xl flex-shrink-0
              bg-gradient-to-br from-cyan-500 to-blue-600
              flex items-center justify-center
              text-white font-semibold text-sm
              shadow-lg
            "
          >
            {getInitials(ownerName)}
          </div>

          <div className="min-w-0 flex-1 hidden md:block">
            <p className="truncate text-sm font-medium text-white">
              {ownerName}
            </p>
            <p className="truncate text-xs text-gray-400">
              {restaurantName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}