import React, { useEffect, useRef, useState } from "react";
import CardModal from "./CreateCard";
import type { CardData, CardProps } from "../../utils/interface/card";
import { cloneCardInColumn } from "../../features/cards/card-slice";
import { useAppDispatch } from "../../store/hooks";
import { BsThreeDotsVertical } from "react-icons/bs";

const Card: React.FC<CardProps> = ({ card, onUpdate, onDelete }) => {
 const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleCardClick = () => {
    if (isMenuOpen) return;
    setIsModalOpen(true);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleCloneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    dispatch(cloneCardInColumn(card.columnId, card.id));
  };
  const handleSave = (updatedCard: CardData) => {
    onUpdate(updatedCard);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative bg-[#222c38] shadow-md rounded-md p-3 mb-2 cursor-pointer hover:bg-[#293442] transition"
      >
         <div
          className="absolute top-3 right-2 z-10"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label="Card options"
            onClick={() => setIsMenuOpen((s) => !s)}
            className="opacity-80 hover:opacity-100"
          >
            <BsThreeDotsVertical />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-md bg-[#222c38] border border-[#3a3f44] shadow-lg z-50 overflow-hidden">
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm"
                onClick={handleCloneClick}
              >
                Clone card
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDelete(card.id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {card.label && card.label !== "none" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3a3f44] text-[#e6edf3]">
            {card.label.toUpperCase()}
          </span>
        )}
        <h3 className="font-semibold text-[#e6edf3] truncate">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-[#9ca3af] mt-1">
            {card.description.length > 33
              ? card.description.slice(0, 33) + "..."
              : card.description}
          </p>
        )}
        {card.dueDate && (
          <p className="text-sm text-[#a3b1c2] mt-1">Due: {card.dueDate}</p>
        )}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex gap-1 mt-2">
            {card.assignees.slice(0, 3).map((name) => (
              <span
                key={name}
                title={name}
                className="w-6 h-6 rounded-full bg-[#3a3f44] text-[#e6edf3] text-[10px] flex items-center justify-center"
              >
                {name.trim().charAt(0).toUpperCase()}
              </span>
            ))}
            {card.assignees.length > 3 && (
              <span className="text-xs text-[#9ca3af]">
                +{card.assignees.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CardModal
          card={card}
          onSave={handleSave}
          onDelete={() => onDelete(card.id)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Card;
