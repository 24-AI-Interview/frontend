import { apiClient } from "./client";

export const uploadSelfIntro = (formData) => apiClient.post("/selfintro", formData);

export const fetchSelfIntros = () => apiClient.get("/selfintro");

export const fetchSelfIntroDetail = (id) => apiClient.get(`/selfintro/${id}`);

export const createSelfIntro = (payload) => apiClient.post("/selfintro", payload);

export const updateSelfIntro = (id, payload) => apiClient.put(`/selfintro/${id}`, payload);

export const deleteSelfIntro = (id) => apiClient.delete(`/selfintro/${id}`);

export const reviseSelfIntro = (payload) => apiClient.post("/selfintro/revise", payload);

export const analyzeSelfIntro = (payload) => apiClient.post("/selfintro/analyze", payload);

export const generateSelfIntroQuestions = (payload) =>
  apiClient.post("/selfintro/questions", payload);

export const compareSelfIntro = (payload) => apiClient.post("/selfintro/compare", payload);

export const summarizeSelfIntro = (payload) => apiClient.post("/selfintro/summary", payload);
