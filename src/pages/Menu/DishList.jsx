// import React, { useState } from "react";
// import { Plus, Menu, Utensils, X, Search, Filter, FolderKanban } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";

// import DishCard from "../../components/menu/DishCard";
// import useMenu from "../../hooks/useMenu";
// import Sidebar from "../../components/Sidebar";

// export default function DishList() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [filterOpen, setFilterOpen] = useState(false);

//   const navigate = useNavigate();
//   const { username } = useParams();

//   const {
//     dishes,
//     filteredDishes,
//     categories,
//     loading,
//     searchQuery,
//     setSearchQuery,
//     selectedCategory,
//     setSelectedCategory,
//     selectedStatus,
//     setSelectedStatus,
//     sortBy,
//     setSortBy,
//     toggleAvailability,
//     deleteDish,
//     clearFilters,
//   } = useMenu();

//   const handleAddNewDish = () => {
//     navigate(`/${username}/menu/add`);
//   };

//   const handleEdit = (dish) => {
//     navigate(`/${username}/dish/${dish._id}/edit`);
//   };

//   const handleManageCategories = () => {
//     navigate(`/${username}/categories`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
//           <p className="text-white mt-4">Loading menu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black">
//       {/* HEADER */}
//       <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
//         <div className="flex items-center justify-between px-4 md:px-8 py-3">
//           {/* Left */}
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="lg:hidden p-2 rounded border border-gray-700 text-gray-400 hover:text-cyan-400"
//             >
//               <Menu className="w-5 h-5" />
//             </button>

//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded bg-cyan-500 flex items-center justify-center">
//                 <Utensils className="text-white w-5 h-5" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-semibold text-white">Dishpop</h1>
//                 <p className="text-xs text-gray-400">Menu Manager</p>
//               </div>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="hidden md:block flex-1 max-w-md mx-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//               <input
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search dishes..."
//                 className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Right */}
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setFilterOpen(!filterOpen)}
//               className="md:hidden p-2 rounded border border-gray-700 text-gray-400 hover:text-cyan-400"
//             >
//               <Filter className="w-5 h-5" />
//             </button>

//             <span className="hidden lg:block text-sm text-gray-300">
//               {filteredDishes.length} / {dishes.length} Dishes
//             </span>

//             {/* Categories Button */}
//             <button
//               onClick={handleManageCategories}
//               className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400"
//             >
//               <FolderKanban className="w-4 h-4" />
//               <span>Categories</span>
//             </button>

//             {/* Addons Button */}
//             <button
//               onClick={() => navigate(`/${username}/addons`)}
//               className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400"
//             >
//               <Plus className="w-4 h-4" />
//               <span>Add-ons</span>
//             </button>

//             <button
//               onClick={handleAddNewDish}
//               className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               <span className="hidden sm:inline">Add Dish</span>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Search */}
//         <div className="md:hidden px-4 pb-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//             <input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search dishes..."
//               className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
//             />
//           </div>

//           {/* Mobile Categories Button */}
//           <button
//             onClick={handleManageCategories}
//             className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400 sm:hidden"
//           >
//             <FolderKanban className="w-4 h-4" />
//             <span>Manage Categories</span>
//           </button>

//           {/* Mobile Addons Button */}
//           <button
//             onClick={() => navigate(`/${username}/addons`)}
//             className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400 sm:hidden"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Manage Add-ons</span>
//           </button>
//         </div>
//       </header>

//       <div className="flex">
//         {/* SIDEBAR */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black/80 z-40 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         <div
//           className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform ${
//             sidebarOpen
//               ? "translate-x-0"
//               : "-translate-x-full lg:translate-x-0"
//           }`}
//         >
//           <Sidebar />
//         </div>

//         {/* MAIN */}
//         <main className="flex-1 px-4 md:px-8 py-6">
//           {/* FILTER BAR */}
//           <div
//             className={`mb-6 ${
//               filterOpen ? "block" : "hidden md:block"
//             }`}
//           >
//             <div className="flex flex-wrap gap-3">
//               {/* Category */}
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="bg-black border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-cyan-500 focus:outline-none"
//               >
//                 <option value="All">All Categories</option>
//                 {categories.slice(1).map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>

//               {/* Status */}
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="bg-black border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-cyan-500 focus:outline-none"
//               >
//                 <option value="All">All Status</option>
//                 <option value="Available">Available</option>
//                 <option value="Unavailable">Unavailable</option>
//               </select>

//               {/* Sort */}
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="bg-black border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-cyan-500 focus:outline-none"
//               >
//                 <option value="name-asc">Sort: Name ↑</option>
//                 <option value="name-desc">Sort: Name ↓</option>
//                 <option value="price-asc">Sort: Price ↑</option>
//                 <option value="price-desc">Sort: Price ↓</option>
//                 <option value="popularity">Sort: Popularity</option>
//               </select>

//               {(searchQuery ||
//                 selectedCategory !== "All" ||
//                 selectedStatus !== "All" ||
//                 sortBy !== "name-asc") && (
//                 <button
//                   onClick={clearFilters}
//                   className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded hover:bg-red-500/20"
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* DISH LIST */}
//           <div className="space-y-4">
//             {filteredDishes.length === 0 ? (
//               <div className="text-center py-20 border border-dashed border-gray-800 rounded">
//                 <Utensils className="w-12 h-12 text-gray-500 mx-auto mb-4" />
//                 <p className="text-gray-400 mb-2">No dishes found</p>
//                 {dishes.length === 0 ? (
//                   <div className="space-y-3">
//                     <p className="text-sm text-gray-500">
//                       Start by creating categories first
//                     </p>
//                     <button
//                       onClick={handleManageCategories}
//                       className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
//                     >
//                       Create Categories
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={clearFilters}
//                     className="mt-4 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
//                   >
//                     Clear Filters
//                   </button>
//                 )}
//               </div>
//             ) : (
//               filteredDishes.map((dish) => (
//                 <DishCard
//                   key={dish._id}
//                   dish={dish}
//                   onToggleAvailability={toggleAvailability}
//                   onEdit={() => handleEdit(dish)}
//                   onDelete={deleteDish}
//                 />
//               ))
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { Plus, Utensils, X, Search, Filter, FolderKanban } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DishCard from "../../components/menu/DishCard";
import useMenu from "../../hooks/useMenu";
import Sidebar from "../../components/Sidebar";

export default function DishList() {
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();

  const {
    dishes,
    filteredDishes,
    categories,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    toggleAvailability,
    deleteDish,
    clearFilters,
  } = useMenu();

  const handleAddNewDish = () => {
    navigate(`/${username}/menu/add`);
  };

  const handleEdit = (dish) => {
    navigate(`/${username}/dish/${dish._id}/edit`);
  };

  const handleManageCategories = () => {
    navigate(`/${username}/categories`);
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-white mt-4">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* SIDEBAR - Always visible */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 md:px-8 py-3">
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {/* <div className="w-10 h-10 rounded bg-cyan-500 flex items-center justify-center"> */}
                  {/* <Utensils className="text-white w-5 h-5" /> */}
                </div>
                {/* <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-white">Dishpop</h1>
                  <p className="text-xs text-gray-400">Menu Manager</p>
                </div> */}
              {/* </div> */}
            </div>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes..."
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden p-2 rounded border border-gray-700 text-gray-400 hover:text-cyan-400"
              >
                <Filter className="w-5 h-5" />
              </button>

              <span className="hidden lg:block text-sm text-gray-300">
                {filteredDishes.length} / {dishes.length} Dishes
              </span>

              {/* Categories Button */}
              <button
                onClick={handleManageCategories}
                className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400"
              >
                <FolderKanban className="w-4 h-4" />
                <span className="hidden lg:inline">Categories</span>
              </button>

              {/* Addons Button */}
              <button
                onClick={() => navigate(`/${username}/addons`)}
                className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">Add-ons</span>
              </button>

              <button
                onClick={handleAddNewDish}
                className="px-3 md:px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Dish</span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Mobile Categories Button */}
            <button
              onClick={handleManageCategories}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400 sm:hidden"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Manage Categories</span>
            </button>

            {/* Mobile Addons Button */}
            <button
              onClick={() => navigate(`/${username}/addons`)}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded hover:border-cyan-500 hover:text-cyan-400 sm:hidden"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Add-ons</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          {/* FILTER BAR */}
          <div
            className={`mb-6 ${
              filterOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="flex flex-wrap gap-3">
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-black border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-cyan-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.slice(1).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-black border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-cyan-500 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-cyan-500 focus:outline-none"
              >
                <option value="name-asc">Sort: Name ↑</option>
                <option value="name-desc">Sort: Name ↓</option>
                <option value="price-asc">Sort: Price ↑</option>
                <option value="price-desc">Sort: Price ↓</option>
                <option value="popularity">Sort: Popularity</option>
              </select>

              {(searchQuery ||
                selectedCategory !== "All" ||
                selectedStatus !== "All" ||
                sortBy !== "name-asc") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded hover:bg-red-500/20"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* DISH LIST */}
          <div className="space-y-4">
            {filteredDishes.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-800 rounded">
                <Utensils className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No dishes found</p>
                {dishes.length === 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      Start by creating categories first
                    </p>
                    <button
                      onClick={handleManageCategories}
                      className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                    >
                      Create Categories
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  onToggleAvailability={toggleAvailability}
                  onEdit={() => handleEdit(dish)}
                  onDelete={deleteDish}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}