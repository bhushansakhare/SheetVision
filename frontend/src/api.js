import axios from "axios";

export const API_BASE = "https://hrms.localbhai.com";
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/signup") &&
        !window.location.pathname.startsWith("/share") &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// Call GET /auth/me to reconcile the cached user against the server's
// current view of their role. If the server mints a new token (role changed
// since last login), swap it in. Frontend calls this on app boot.
export async function refreshSession() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const { data } = await api.get("/auth/me");
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data.user || null;
  } catch {
    return null;
  }
}

export default api;
