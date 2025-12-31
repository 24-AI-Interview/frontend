const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";
const EXPIRES_AT_KEY = "auth.expiresAt";
const USER_KEY = "auth.user";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getExpiresAt = () => {
  const raw = localStorage.getItem(EXPIRES_AT_KEY);
  return raw ? Number(raw) : null;
};

export const setTokens = ({ accessToken, refreshToken, expiresIn } = {}) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (typeof expiresIn === "number") {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
};

export const setStoredUser = (user) => {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};
