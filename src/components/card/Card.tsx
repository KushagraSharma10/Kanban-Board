import React, { useEffect, useRef, useState } from "react";
import CardModal from "./CreateCard";
import type { CardData, CardProps } from "../../utils/interface/card";
import { useAppDispatch } from "../../app/store/hooks";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MAX_DESCRIPTION_LENGTH } from "../../utils/constants/card";
import { cloneCardInColumnOnServer } from "../../app/thunks/card.thunks";
import DeleteConfirmation from "../DeleteConfirmation";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { isBoardAdmin } from "../../lib/permissions";

const Card: React.FC<CardProps> = ({ card, onUpdate, onDelete }) => {
  const dispatch = useAppDispatch();
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isConfirmingDeletion, setIsConfirmingDeletion] =
    useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleCardClick = (): void => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleCloneClick = async (e: React.MouseEvent) => {
  e.stopPropagation();
  setIsMenuOpen(false);

  const allowed = await isBoardAdmin(card.boardId);
  if (!allowed) {
    toast.error("Only admins can clone or add cards on this board");
    return;
  }

  dispatch(cloneCardInColumnOnServer(card.boardId, card.columnId, card.id));
};
  const handleSave = (updatedCard: CardData) => {
    onUpdate(updatedCard);
    setIsCardModalOpen(false);
  };
  const handleKeyDown = (event:React.KeyboardEvent<HTMLDivElement> ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleOpenEditModal = (
    mouseEvent: React.MouseEvent<HTMLButtonElement>
  ): void => {
    mouseEvent.stopPropagation();
    setIsCardModalOpen(true);
  };

  const handleDeleteCard = (
    mouseEvent: React.MouseEvent<HTMLButtonElement>
  ): void => {
    mouseEvent.stopPropagation();
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDeletion = (): void => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDeletion = async (): Promise<void> => {
    try {
      setIsConfirmingDeletion(true);
      onDelete(card.id);
    } finally {
      setIsConfirmingDeletion(false);
      setIsDeleteModalOpen(false);
      setIsCardModalOpen(false);
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className="relative bg-[#222c38] shadow-md rounded-md p-3 mb-2 cursor-pointer hover:bg-[#293442] transition"
      >
        <div
          className="absolute top-3 right-2 z-10 flex items-center gap-2"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label="Edit card"
            title="Edit"
            onClick={handleOpenEditModal}
            className="opacity-90 hover:opacity-100 hover:scale-[1.03] transition cursor-pointer"
          >
            <FiEdit2 />
          </button>
          <button
            aria-label="Card options"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="opacity-80 hover:opacity-100 cursor-pointer"
          >
            <BsThreeDotsVertical />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-md bg-theme-popover border border-theme-borderMuted shadow-lg z-50 overflow-hidden">
              <button
                className="w-full text-left px-3 py-2 hover:bg-theme-hoverSoft text-sm"
                onClick={handleCloneClick}
              >
                Clone card
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-theme-hoverSoft text-sm text-red-400"
                onClick={handleDeleteCard}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {card.label && card.label !== "none" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-theme-chipBg text-theme-textPrimary">
            {card.label.toUpperCase()}
          </span>
        )}

        <h3 className="font-semibold text-theme-textPrimary truncate">
          {card.title}
        </h3>

        {card.description && (
          <p className="text-sm text-theme-textMuted2 mt-1">
            {card.description.length > MAX_DESCRIPTION_LENGTH
              ? card.description.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
              : card.description}
          </p>
        )}

        {card.dueDate && (
          <p className="text-sm text-theme-textSecondary mt-1">
            Due: {card.dueDate}
          </p>
        )}

        {card.assigneeEmail && (
          <div className="flex items-center gap-2 mt-2">
            <span
              title={card.assigneeEmail}
              className="w-6 h-6 rounded-full bg-theme-chipBg text-theme-textPrimary text-xs flex items-center justify-center"
            >
              {card.assigneeEmail.trim().charAt(0).toUpperCase()}
            </span>
            <span className="text-xs text-theme-textMuted2 truncate">
              {card.assigneeEmail}
            </span>
          </div>
        )}
      </div>

      {isCardModalOpen && (
        <CardModal
          card={card}
          onSave={handleSave}
          onClose={() => setIsCardModalOpen(false)}
        />
      )}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        itemName={card.title}
        onCancel={handleCancelDeletion}
        onConfirm={handleConfirmDeletion}
        isConfirming={isConfirmingDeletion}
      />
    </>
  );
};

export default Card;
