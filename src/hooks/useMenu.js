import { useState, useEffect, useMemo } from "react";
import menuApi from "../api/menuApi";
import { useParams } from "react-router-dom";

export default function useMenu() {
  const { username } = useParams();
  const RESTAURANT_ID = username;

  /* ================= CORE STATE ================= */
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses] = useState(["All Statuses", "Available", "Unavailable"]);
  const [statistics, setStatistics] = useState(null);

  /* ================= UI STATE ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("name-asc");

  /* ================= LOADING ================= */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ============================================================
     1️⃣ FETCH MENU
  ============================================================ */
  const fetchMenu = async () => {
    if (!RESTAURANT_ID) return;

    setLoading(true);
    setError(null);

    try {
      const res = await menuApi.getMenu(RESTAURANT_ID);
      const data = res.data?.data ?? {};
      const list = data.dishes ?? [];

      setDishes(list);

      setCategories([
        "All Categories",
        ...new Set(list.map((d) => d.category || "Uncategorized")),
      ]);

      setStatistics({
        total: list.length,
        available: list.filter((d) => d.available).length,
        byStatus: {
          ready: list.length,
          processing: 0,
        },
      });
    } catch (e) {
      console.error("Menu fetch error:", e);
      setError("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [RESTAURANT_ID]);

  /* ============================================================
     2️⃣ SEARCH DEBOUNCE
  ============================================================ */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* ============================================================
     3️⃣ FILTER + SORT
  ============================================================ */
  const filteredDishes = useMemo(() => {
    if (loading) return [];

    let list = [...dishes];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }

    if (selectedCategory !== "All Categories") {
      list = list.filter((d) => d.category === selectedCategory);
    }

    if (selectedStatus !== "All Statuses") {
      const shouldBe = selectedStatus === "Available";
      list = list.filter((d) => d.available === shouldBe);
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [
    dishes,
    debouncedSearch,
    selectedCategory,
    selectedStatus,
    sortBy,
    loading,
  ]);

  /* ============================================================
     4️⃣ TOGGLE AVAILABILITY (FIXED + SAFE)
  ============================================================ */
  const toggleAvailability = async (dishId) => {
    const previousDishes = dishes;

    const dish = dishes.find((d) => d._id === dishId);
    if (!dish) return;

    const newAvailable = !dish.available;

    // Optimistic UI
    setDishes((prev) =>
      prev.map((d) =>
        d._id === dishId ? { ...d, available: newAvailable } : d
      )
    );

    try {
      const res = await menuApi.toggleAvailability(
        RESTAURANT_ID,
        dishId,
        newAvailable
      );

      const updatedAvailable =
        res.data?.data?.available ?? newAvailable;

      setDishes((prev) =>
        prev.map((d) =>
          d._id === dishId ? { ...d, available: updatedAvailable } : d
        )
      );

      setStatistics((prev) => ({
        ...prev,
        available: updatedAvailable
          ? prev.available + 1
          : prev.available - 1,
      }));
    } catch (err) {
      console.error("toggleAvailability error:", err);
      setDishes(previousDishes); // rollback
      throw err; // allow UI animation rollback
    }
  };

  /* ============================================================
     5️⃣ DELETE DISH
  ============================================================ */
  const deleteDish = async (dishId) => {
    const previous = dishes;

    setDishes((prev) => prev.filter((d) => d._id !== dishId));

    try {
      await menuApi.deleteDish(RESTAURANT_ID, dishId);
    } catch (err) {
      console.error("Delete error:", err);
      setDishes(previous);
    }
  };

  /* ============================================================
     6️⃣ REFRESH ON TAB FOCUS
  ============================================================ */
  useEffect(() => {
    const onFocus = () => fetchMenu();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [RESTAURANT_ID]);

  /* ============================================================
     7️⃣ CLEAR FILTERS
  ============================================================ */
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Statuses");
    setSortBy("name-asc");
  };

  /* ================= EXPORT ================= */
  return {
    loading,
    error,
    dishes,
    filteredDishes,
    categories,
    statuses,
    statistics,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setSortBy,
    toggleAvailability,
    deleteDish,
    clearFilters,
  };
}
