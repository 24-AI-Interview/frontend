import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const hasPromptedRef = useRef(false);

  useEffect(() => {
    if (loading || isAuthenticated || hasPromptedRef.current) return;
    hasPromptedRef.current = true;
    window.alert("로그인이 필요합니다.");
    navigate("/login", { replace: true, state: { from: location } });
  }, [isAuthenticated, loading, location, navigate]);

  if (loading || !isAuthenticated) return null;

  return <Outlet />;
}
