import React from "react";
import { useNavigate } from "react-router";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = (): void => {
    navigate("/");
  };

  return (
    <main
      className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 text-white"
      role="main"
      aria-labelledby="error-heading"
    >
      <h1 id="error-heading" className="text-5xl font-bold mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-8 text-gray-300">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={handleGoHome}
        aria-label="Navigate back to home page"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-lg font-semibold transition-all duration-200"
      >
        Go Back to Home
      </button>
    </main>
  );
};

export default PageNotFound;
