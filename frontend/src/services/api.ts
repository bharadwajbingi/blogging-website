import axios from "axios";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  getMe: () => api.get("/auth/me"),
};

export const postsAPI = {
  getPosts: (params?: any) => api.get("/posts", { params }),
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (data: any) => api.post("/posts", data),
  updatePost: (id: string, data: any) => api.put(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  likePost: (id: string) => api.put(`/posts/${id}/like`),
};

export const userAPI = {
  updateProfile: (data: any) => api.put("/users/profile", data),
  getUserProfile: (id: string) => api.get(`/users/profile/${id}`),
  getDashboard: () => api.get("/users/dashboard"),
};

export const searchAPI = {
  searchPosts: (params: any) => api.get("/search/posts", { params }),
  getTags: () => api.get("/search/tags"),
  getPostsByTag: (tag: string, params?: any) =>
    api.get(`/search/tags/${tag}`, { params }),
};

export default api;
