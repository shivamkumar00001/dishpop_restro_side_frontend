const KEY = "cached-orders";

export function saveOrders(orders) {
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function loadOrders() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
