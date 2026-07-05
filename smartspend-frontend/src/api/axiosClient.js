import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: `${API_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartspend_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("smartspend_token");
      localStorage.removeItem("smartspend_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const API_BASE_URL = API_URL;
export default axiosClient;
