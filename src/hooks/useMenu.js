import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import menuApi from "../api/menuApi";

export default function useMenu() {
  const { username } = useParams();

  // State
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  // Load menu data
  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await menuApi.getMenu(username);
      const data = response.data.data;

      // Extract dishes from menu structure
      const allDishes = data.menu.flatMap((cat) => cat.dishes);
      setDishes(allDishes);

      // Extract unique categories
      const uniqueCategories = [
        "All",
        ...data.categories.map((c) => c.name),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to load menu:", err);
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    let filtered = [...dishes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (dish) => dish.categoryId?.name === selectedCategory
      );
    }

    // Status filter
    if (selectedStatus === "Available") {
      filtered = filtered.filter((dish) => dish.isAvailable);
    } else if (selectedStatus === "Unavailable") {
      filtered = filtered.filter((dish) => !dish.isAvailable);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc": {
          const priceA = a.variants?.[0]?.price || 0;
          const priceB = b.variants?.[0]?.price || 0;
          return priceA - priceB;
        }
        case "price-desc": {
          const priceA = a.variants?.[0]?.price || 0;
          const priceB = b.variants?.[0]?.price || 0;
          return priceB - priceA;
        }
        case "popularity":
          return (b.popularityScore || 0) - (a.popularityScore || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [dishes, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Toggle availability
  const toggleAvailability = useCallback(
    async (dishId) => {
      try {
        const response = await menuApi.toggleAvailability(username, dishId);
        const updatedDish = response.data.data;

        setDishes((prev) =>
          prev.map((dish) =>
            dish._id === dishId
              ? { ...dish, isAvailable: updatedDish.isAvailable }
              : dish
          )
        );
      } catch (err) {
        console.error("Failed to toggle availability:", err);
        alert(err.response?.data?.message || "Failed to toggle availability");
      }
    },
    [username]
  );

  // Delete dish
  const deleteDish = useCallback(
    async (dishId) => {
      if (!window.confirm("Are you sure you want to delete this dish?")) {
        return;
      }

      try {
        await menuApi.deleteDish(username, dishId);
        setDishes((prev) => prev.filter((dish) => dish._id !== dishId));
      } catch (err) {
        console.error("Failed to delete dish:", err);
        alert(err.response?.data?.message || "Failed to delete dish");
      }
    },
    [username]
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSortBy("name-asc");
  }, []);

  return {
    dishes,
    filteredDishes,
    categories,
    loading,
    error,
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
    refreshMenu: loadMenu,
  };
}