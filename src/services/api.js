// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: import.meta.env.VITE_API_URL,
// //   withCredentials: true,
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // let isRefreshing = false;

// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     // ❌ If no response (network error)
// //     if (!error.response) {
// //       return Promise.reject(error);
// //     }

// //     const status = error.response.status;
// //     const url = originalRequest?.url || "";

// //     // ❌ NEVER try refresh on auth routes
// //     if (
// //       url.includes("/auth/login") ||
// //       url.includes("/auth/register") ||
// //       url.includes("/auth/refresh") ||
// //       url.includes("/auth/me") ||
// //       url.includes("/auth/forgot") ||
// //       url.includes("/auth/reset")
// //     ) {
// //       return Promise.reject(error);
// //     }

// //     // ❌ Already retried once
// //     if (originalRequest._retry) {
// //       return Promise.reject(error);
// //     }

// //     // 🔐 Handle ONLY 401
// //     if (status === 401) {
// //       originalRequest._retry = true;

// //       if (isRefreshing) {
// //         return Promise.reject(error);
// //       }

// //       isRefreshing = true;

// //       try {
// //         await api.get("/auth/refresh");
// //         isRefreshing = false;
// //         return api(originalRequest);
// //       } catch (refreshError) {
// //         isRefreshing = false;
// //         window.location.replace("/login");
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // export default api;
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // ❌ If no response (network error)
//     if (!error.response) {
//       return Promise.reject(error);
//     }

//     const status = error.response.status;
//     const url = originalRequest?.url || "";

//     // ❌ ONLY skip refresh on login/register/refresh routes
//     if (
//       url.includes("/auth/login") ||
//       url.includes("/auth/register") ||
//       url.includes("/auth/refresh") ||
//       url.includes("/auth/forgot") ||
//       url.includes("/auth/reset")
//     ) {
//       return Promise.reject(error);
//     }

//     // ❌ Already retried once
//     if (originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     // 🔐 Handle 401 - token expired
//     if (status === 401) {
//       if (isRefreshing) {
//         // Queue this request until refresh completes
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => {
//             return api(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         await api.get("/auth/refresh");
//         isRefreshing = false;
//         processQueue(null);
//         return api(originalRequest);
//       } catch (refreshError) {
//         isRefreshing = false;
//         processQueue(refreshError);
        
//         // Clear any stored auth state
//         localStorage.clear();
//         sessionStorage.clear();
        
//         // Redirect to login
//         window.location.replace("/login");
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔥 REQUIRED FOR COOKIE AUTH
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    // 🚫 Never retry auth endpoints
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/forgot") ||
      url.includes("/auth/reset")
    ) {
      return Promise.reject(error);
    }

    // 🚫 Already retried once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // 🔐 Handle expired access token
    if (status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🔥 MUST BE POST (matches backend)
        await api.post("/auth/refresh");

        isRefreshing = false;
        processQueue();

        return api(originalRequest);
      } catch (refreshError) {
  isRefreshing = false;
  processQueue(refreshError);

  localStorage.clear();
  sessionStorage.clear();

  // 🔥 Notify React, do NOT redirect here
  window.dispatchEvent(new Event("auth:logout"));

  return Promise.reject(refreshError);
}

    }

    return Promise.reject(error);
  }
);

export default api;
