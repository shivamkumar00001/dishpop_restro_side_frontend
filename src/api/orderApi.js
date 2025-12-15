import axiosClient from "./axiosClient";

export const fetchOrders = (username) =>
  axiosClient.get(`/restaurants/${username}/orders`);

export const updateOrderStatus = (username, orderId, status) =>
  axiosClient.patch(
    `/restaurants/${username}/orders/${orderId}/status`,
    { status }
  );
