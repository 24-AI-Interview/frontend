import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, logout as logoutApi, signup as signupApi, fetchMe } from "../api/auth";
import {
  clearStoredUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setStoredUser,
  setTokens,
} from "./authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [accessToken, setAccessToken] = useState(() => getAccessToken());
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(accessToken);

  useEffect(() => {
    const init = async () => {
      if (!accessToken || user) return;
      setLoading(true);
      try {
        const profile = await fetchMe();
        setUser(profile);
        setStoredUser(profile);
      } catch (error) {
        clearTokens();
        clearStoredUser();
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [accessToken, user]);

  const login = async (payload) => {
    const data = await loginApi(payload);
    setTokens(data.tokens);
    setAccessToken(data.tokens?.accessToken || null);
    setUser(data.user || null);
    setStoredUser(data.user || null);
    return data;
  };

  const signup = async (payload) => {
    const data = await signupApi(payload);
    setTokens(data.tokens);
    setAccessToken(data.tokens?.accessToken || null);
    setUser(data.user || null);
    setStoredUser(data.user || null);
    return data;
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logoutApi({ refreshToken });
      }
    } catch (error) {
      // Ignore logout errors on client-side cleanup.
    } finally {
      clearTokens();
      clearStoredUser();
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      loading,
      login,
      signup,
      logout,
      setUser,
    }),
    [user, accessToken, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
