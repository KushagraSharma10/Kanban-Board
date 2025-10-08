import React from "react";
import type { LoginPromptModalProps } from "../utils/types/login-prompt";

const LoginPrompt: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onLoginClick,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-[5px]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-6">
          You are not logged in. Please log in to continue.
        </p>
        <button
          onClick={onLoginClick}
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold hover:cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
