
import dishesData from '../assets/Data/dishes.json';

class DishService {
  constructor() {
    this.dishes = dishesData.dishes;
    this.categories = dishesData.categories;
  }

  // Get all dishes
  getAllDishes() {
    return this.dishes;
  }

  // Get dish by ID
  getDishById(id) {
    return this.dishes.find(dish => dish.id === id);
  }

  // Get all categories
  getCategories() {
    return ['All Categories', ...this.categories.map(cat => cat.name)];
  }

  // Get all statuses
  getStatuses() {
    const uniqueStatuses = [...new Set(this.dishes.map(dish => dish.status))];
    return ['All Statuses', ...uniqueStatuses];
  }

  // Filter dishes
  filterDishes({ searchQuery = '', category = 'All Categories', status = 'All Statuses' }) {
    let filtered = this.dishes;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dish => 
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query) ||
        dish.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (category !== 'All Categories') {
      filtered = filtered.filter(dish => dish.category === category);
    }

    // Filter by status
    if (status !== 'All Statuses') {
      filtered = filtered.filter(dish => dish.status === status);
    }

    return filtered;
  }

  // Sort dishes
  sortDishes(dishes, sortBy) {
    const sorted = [...dishes];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      default:
        return sorted;
    }
  }

  // Get dishes by category
  getDishesByCategory(category) {
    return this.dishes.filter(dish => dish.category === category);
  }

  // Get available dishes
  getAvailableDishes() {
    return this.dishes.filter(dish => dish.available);
  }

  // Get vegetarian dishes
  getVegetarianDishes() {
    return this.dishes.filter(dish => dish.isVegetarian);
  }

  // Get vegan dishes
  getVeganDishes() {
    return this.dishes.filter(dish => dish.isVegan);
  }

  // Toggle dish availability
  toggleAvailability(dishId) {
    const dish = this.getDishById(dishId);
    if (dish) {
      dish.available = !dish.available;
      return dish;
    }
    return null;
  }

  // Update dish status
  updateDishStatus(dishId, newStatus) {
    const dish = this.getDishById(dishId);
    if (dish) {
      dish.status = newStatus;
      dish.updatedAt = new Date().toISOString();
      return dish;
    }
    return null;
  }

  // Get statistics
  getStatistics() {
    return {
      total: this.dishes.length,
      available: this.dishes.filter(d => d.available).length,
      unavailable: this.dishes.filter(d => !d.available).length,
      byCategory: this.categories.map(cat => ({
        name: cat.name,
        count: this.dishes.filter(d => d.category === cat.name).length
      })),
      byStatus: {
        ready: this.dishes.filter(d => d.status === 'Ready').length,
        processing: this.dishes.filter(d => d.status === 'Processing').length,
        failed: this.dishes.filter(d => d.status === 'Failed').length
      }
    };
  }
}

// Create singleton instance
const dishService = new DishService();

export default dishService;