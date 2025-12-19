import axiosClient from "./axiosClient";

const categoryApi = {
  getCategories(username) {
    return axiosClient.get(`/restaurants/${username}/categories`);
  },

  createCategory(username, payload) {
    return axiosClient.post(
      `/restaurants/${username}/categories`,
      payload
    );
  },

  updateCategory(username, categoryId, payload) {
    return axiosClient.patch(
      `/restaurants/${username}/categories/${categoryId}`,
      payload
    );
  },

  deleteCategory(username, categoryId) {
    return axiosClient.delete(
      `/restaurants/${username}/categories/${categoryId}`
    );
  },
};

export default categoryApi;
