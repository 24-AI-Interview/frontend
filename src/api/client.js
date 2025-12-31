import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../auth/authStorage";

const BASE_URL = "/api";
let refreshPromise = null;

const shouldSkipRefresh = (path, options = {}) => {
  if (options.skipAuthRefresh) return true;
  if (path.startsWith("/auth/login")) return true;
  if (path.startsWith("/auth/signup")) return true;
  if (path.startsWith("/auth/refresh")) return true;
  return false;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      setTokens({
        accessToken: data.accessToken,
        refreshToken,
        expiresIn: data.expiresIn,
      });
      return data.accessToken;
    } catch (error) {
      clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers = { ...(options.headers || {}) };
  const accessToken = getAccessToken();
  if (accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(url, { ...options, headers });

  if (
    res.status === 401 &&
    !options._retry &&
    !shouldSkipRefresh(path, options)
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request(path, {
        ...options,
        _retry: true,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${newToken}` },
      });
    }
  }

  if (!res.ok) {
    const error = new Error(`API Error: ${res.status}`);
    error.status = res.status;
    error.response = res;
    throw error;
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (path, body, options) =>
    request(path, { ...options, method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
