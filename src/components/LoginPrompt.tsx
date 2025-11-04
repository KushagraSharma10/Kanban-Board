import React, { useEffect, useRef } from "react";

type LoginPromptModalProps = {
  isOpen: boolean;
  onLoginClick: () => void;
};

const LoginPrompt: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onLoginClick,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onLoginClick();
    };

    document.addEventListener("keydown", handleEscape);
    modalRef.current?.focus();

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onLoginClick]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-[5px]"
      onClick={onLoginClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 p-8 rounded-lg shadow-xl text-center text-white"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 id="login-prompt-title" className="text-2xl font-bold mb-4">
          Authentication Required
        </h2>
        <p className="mb-6">
          You are not logged in. Please log in to continue.
        </p>
        <button
          onClick={onLoginClick}
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold hover:cursor-pointer"
          aria-label="Go to login page"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
