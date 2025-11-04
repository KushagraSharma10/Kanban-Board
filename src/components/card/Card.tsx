import React, { useState } from "react";
import CardModal from "./CreateCard";
import type { CardData, CardProps } from "../../utils/interface/card";
import { MAX_DESCRIPTION_LENGTH } from "../../utils/constants/card";

const Card: React.FC<CardProps> = ({ card, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleSave = (updatedCard: CardData) => {
    onUpdate(updatedCard);
    setIsModalOpen(false);
  };
  const handleKeyDown = (event:React.KeyboardEvent<HTMLDivElement> ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className="bg-[#222c38] shadow-md rounded-md p-3 mb-2 cursor-pointer hover:bg-[#293442] transition focus:outline-none focus:ring-2 focus:ring-[#0096ff]"
      >
        {card.label && card.label !== "none" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3a3f44] text-[#e6edf3]">
            {card.label.toUpperCase()}
          </span>
        )}
        <h3 className="font-semibold text-[#e6edf3] truncate">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-[#9ca3af] mt-1">
            {card.description.length > MAX_DESCRIPTION_LENGTH
              ? card.description.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
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
