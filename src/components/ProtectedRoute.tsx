import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import LoginPrompt from "../components/LoginPrompt";
import { getSession } from "../utils/session";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setIsAuthed(!!getSession());
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      const timer = setTimeout(() => setShowLogin(true), 2000);
      return () => clearTimeout(timer);
    }
    setShowLogin(false);
  }, [isAuthed]);

  const handleLoginClick = () => {
    navigate("/login");
  };
  
  return (
    <>
      <Outlet />
      {!isAuthed && (
        <LoginPrompt isOpen={showLogin} onLoginClick={handleLoginClick} />
      )}
    </>
  );
};

export default ProtectedRoute;
