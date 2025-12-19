import axiosClient from "./axiosClient";

const addonApi = {
  /* ================= ADDON GROUPS ================= */
  
  // Get all add-on groups
  getGroups(username) {
    return axiosClient.get(`/${username}/addon-groups`);
  },

  // Create add-on group
  createGroup(username, data) {
    return axiosClient.post(`/${username}/addon-groups`, data);
  },

  // ✅ Update add-on group
  updateGroup(username, groupId, data) {
    return axiosClient.patch(`/${username}/addon-groups/${groupId}`, data);
  },

  // ✅ Delete add-on group
  deleteGroup(username, groupId) {
    return axiosClient.delete(`/${username}/addon-groups/${groupId}`);
  },

  /* ================= INDIVIDUAL ADDONS ================= */
  
  // Get all add-ons
  getAddons(username) {
    return axiosClient.get(`/${username}/addons`);
  },

  // Create add-on
  createAddon(username, data) {
    return axiosClient.post(`/${username}/addons`, data);
  },

  // ✅ Update add-on
  updateAddon(username, addonId, data) {
    return axiosClient.patch(`/${username}/addons/${addonId}`, data);
  },

  // ✅ Delete add-on
  deleteAddon(username, addonId) {
    return axiosClient.delete(`/${username}/addons/${addonId}`);
  },
};

export default addonApi;