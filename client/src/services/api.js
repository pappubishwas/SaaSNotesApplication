import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function login(email, password) {
  return api.post("/auth/login", { email, password }).then((r) => r.data);
}

export function getNotes() {
  return api.get("/notes").then((r) => r.data);
}
export function createNote(payload) {
  return api.post("/notes", payload).then((r) => r.data);
}
export function deleteNote(id) {
  return api.delete(`/notes/${id}`).then((r) => r.data);
}
export function updateNote(id, payload) {
  return api.put(`/notes/${id}`, payload).then((r) => r.data);
}

export function upgradeTenant(slug) {
  return api.post(`/tenants/${slug}/upgrade`).then((r) => r.data);
}
export function getMe() {
  return api.get('/auth/me').then(r => r.data);
}
export function getTenantBySlug(slug) {
  return api.get(`/tenants/${slug}`).then((r) => r.data);
}

export default api;
