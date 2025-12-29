import { apiClient } from "./client";

const withQuery = (path, params) => {
  const qs = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    qs.set(key, value);
  });
  const query = qs.toString();
  return query ? `${path}?${query}` : path;
};

export const fetchSavedJobs = ({ userId } = {}) =>
  apiClient.get(withQuery("/jobs/saved", { userId }));
