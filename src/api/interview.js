import { apiClient } from "./client";

export const fetchInterviewQuestions = ({ job } = {}) => {
  const params = new URLSearchParams();
  if (job) params.set("job", job);
  const query = params.toString();
  return apiClient.get(query ? `/interview/questions?${query}` : "/interview/questions");
};

export const fetchInterviewHistory = ({ userId } = {}) => {
  const params = new URLSearchParams();
  if (userId) params.set("userId", userId);
  const query = params.toString();
  return apiClient.get(query ? `/interviews?${query}` : "/interviews");
};
