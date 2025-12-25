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
  XMarkIcon,
  Cog6ToothIcon,
  QrCodeIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
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

  /* =========================
     LOCK BODY SCROLL (MOBILE)
  ========================= */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    <>
      {/* ================= MOBILE / TABLET TOP BAR ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-[#0d1117] border-b border-white/10 flex items-center px-4">
        <button
          onClick={() => setOpen(true)}
          className="text-gray-300 hover:text-white"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <h1 className="ml-4 text-sm font-semibold text-white truncate">
          {restaurantName}
        </h1>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          lg:hidden
        `}
        onClick={() => setOpen(false)}
      />

      {/* ================= SIDEBAR ================= */}
      {/* <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-[#0d1117] border-r border-white/10
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `} */}
        <aside
  className={`
    fixed left-0 z-50 w-64
    bg-[#0d1117] border-r border-white/10
    flex flex-col
    transform transition-transform duration-300 ease-in-out

    /* MOBILE & TABLET */
    top-14 h-[calc(100vh-3.5rem)]

    /* DESKTOP */
    lg:top-0 lg:h-screen lg:translate-x-0 lg:static lg:z-auto

    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
>

      
        {/* ================= MOBILE CLOSE ================= */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* ================= BRAND ================= */}
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Dish<span className="text-cyan-400">Pop</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Restaurant Dashboard
          </p>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <li key={label}>
                  <Link
                    to={path}
                    onClick={() => setOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all
                      ${
                        active
                          ? "bg-cyan-500/15 text-cyan-400 shadow-inner"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {getInitials(ownerName)}
            </div>

            <div className="min-w-0">
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

      {/* ================= CONTENT OFFSET FOR MOBILE ================= */}
      {/* <div className="lg:hidden h-14" /> */}
    </>
  );
}
   