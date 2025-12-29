import { apiClient } from "./client";

export const fetchPrepQuestions = ({ job, level }) => {
  const params = new URLSearchParams({ job, ...(level ? { level } : {}) });
  return apiClient.get(`/prep/questions?${params.toString()}`);
};

export const fetchPrepVideos = () => apiClient.get("/prep/videos");

export const addPrepBookmark = (payload) => apiClient.post("/prep/bookmark", payload);

export const deletePrepBookmark = (id) => apiClient.delete(`/prep/bookmark/${id}`);

export const fetchPrepBookmarks = () => apiClient.get("/prep/bookmarks");
