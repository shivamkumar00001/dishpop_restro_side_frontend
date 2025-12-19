import axiosClient from "./axiosClient";

const menuApi = {
  /* ================= MENU ================= */
  getMenu(username) {
    return axiosClient.get(`/restaurants/${username}/menu`);
  },

  createDish(username, formData) {
    return axiosClient.post(`/restaurants/${username}/menu`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateDish(username, dishId, formData) {
    return axiosClient.patch(
      `/restaurants/${username}/dishes/${dishId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  deleteDish(username, dishId) {
    return axiosClient.delete(`/restaurants/${username}/dishes/${dishId}`);
  },

  toggleAvailability(username, dishId) {
    return axiosClient.patch(`/restaurants/${username}/menu/${dishId}/toggle`);
  },

  getDish(username, dishId) {
    return axiosClient.get(`/restaurants/${username}/dishes/${dishId}`);
  },

  /* ================= CATEGORY ================= */
  getCategories(username) {
    return axiosClient.get(`/restaurants/${username}/categories`);
  },

  createCategory(username, data) {
    return axiosClient.post(`/restaurants/${username}/categories`, data);
  },

  updateCategory(username, categoryId, data) {
    return axiosClient.patch(
      `/restaurants/${username}/categories/${categoryId}`,
      data
    );
  },

  deleteCategory(username, categoryId) {
    return axiosClient.delete(
      `/restaurants/${username}/categories/${categoryId}`
    );
  },

  /* ================= ADDONS ================= */
  getAddOnGroups(username) {
    return axiosClient.get(`/${username}/addon-groups`);
  },

  createAddOnGroup(username, data) {
    return axiosClient.post(`/${username}/addon-groups`, data);
  },

  getAddOns(username) {
    return axiosClient.get(`/${username}/addons`);
  },

  createAddOn(username, data) {
    return axiosClient.post(`/${username}/addons`, data);
  },
};

export default menuApi;