import { apiClient } from "./client";

export const signup = (payload) => apiClient.post("/auth/signup", payload);
export const login = (payload) => apiClient.post("/auth/login", payload);
export const logout = (payload) => apiClient.post("/auth/logout", payload);
export const refresh = (payload) => apiClient.post("/auth/refresh", payload);
export const fetchMe = () => apiClient.get("/auth/me");
