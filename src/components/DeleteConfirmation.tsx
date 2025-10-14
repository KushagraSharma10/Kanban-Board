import React, { useEffect, useRef } from "react";
import type { DeleteConfirmationModel } from "../utils/types/delete-confirmation";


const DeleteConfirmation: React.FC<DeleteConfirmationModel> = ({
  isOpen,
  itemName,
  onCancel,
  onConfirm,
  isConfirming = false,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => cancelButtonRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    keyboardEvent
  ) => {
    if (keyboardEvent.key === "Escape") {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F14]/90 p-6 text-white shadow-2xl">
        <h2 id="delete-modal-title" className="text-xl font-semibold">
          Confirm Deletion
        </h2>
        <p id="delete-modal-description" className="mt-3 text-white/80">
          Do you really want to delete{" "}
          <span className="font-semibold text-white">"{itemName}"</span>?
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition cursor-pointer hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`inline-flex items-center justify-center cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0
              ${
                isConfirming
                  ? "cursor-not-allowed bg-red-700/60 opacity-80"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {isConfirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
