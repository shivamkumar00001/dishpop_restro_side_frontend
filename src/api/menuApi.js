import axiosClient from "./AxiosClient";

const menuApi = {

  // ------------------------------------------
  // GET MENU BY USERNAME
  // GET /restaurants/:username/menu
  // ------------------------------------------
  getMenu(username) {
    return axiosClient.get(`/restaurants/${username}/menu`);
  },

  // ------------------------------------------
  // CREATE DISH
  // POST /restaurants/:username/menu
  // ------------------------------------------
  createDish(username, formData) {
    return axiosClient.post(
      `/restaurants/${username}/menu`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // ------------------------------------------
  // UPDATE DISH
  // PATCH /restaurants/:username/dishes/:dishId
  // ------------------------------------------
  updateDish(username, dishId, formData) {
    return axiosClient.patch(
      `/restaurants/${username}/dishes/${dishId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // ------------------------------------------
  // DELETE DISH
  // DELETE /restaurants/:username/dishes/:dishId
  // ------------------------------------------
  deleteDish(username, dishId) {
    return axiosClient.delete(
      `/restaurants/${username}/dishes/${dishId}`
    );
  },

  // ------------------------------------------
  // TOGGLE AVAILABILITY
  // PATCH /restaurants/:username/dishes/:dishId
  // Backend expects: { available: true/false }
  // ------------------------------------------
  toggleAvailability(username, dishId, available) {
    return axiosClient.patch(
      `/restaurants/${username}/dishes/${dishId}`,
      { available }
    );
  }

};

export default menuApi;
