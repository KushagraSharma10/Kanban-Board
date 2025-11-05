import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAppSelector } from "../app/store/hooks";
import { selectAuthUser, selectAccessToken } from "../app/slices/auth.slice";
import LoginPrompt from "../components/LoginPrompt";
import type { ProtectedRouteProps } from "../utils/interface/protected-route";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  mode = "prompt",
  promptDelayMs = 1500,
}) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);
  const accessToken = useAppSelector(selectAccessToken);

  const isAuthenticated = useMemo(
    () => Boolean(user && accessToken),
    [user, accessToken]
  );

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isAuthenticated && mode === "prompt") {
      timerRef.current = window.setTimeout(() => {
        setShowLoginPrompt(true);
      }, promptDelayMs);
    } else {
      setShowLoginPrompt(false);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAuthenticated, mode, promptDelayMs]);

  useEffect(() => {
    if (!isAuthenticated && mode === "redirect") {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, mode, navigate]);

  const handleLoginClick = () => {
    navigate("/login");
  };
  
  return (
    <>
      <Outlet />

      {mode === "prompt" && !isAuthenticated && (
        <LoginPrompt isOpen={showLoginPrompt} onLoginClick={handleLoginClick} />
      )}
    </>
  );
};

export default ProtectedRoute;
