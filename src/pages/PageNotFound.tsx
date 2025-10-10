import React from "react";
import { useNavigate } from "react-router";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = (): void => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8 text-gray-300">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-200"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default PageNotFound;
