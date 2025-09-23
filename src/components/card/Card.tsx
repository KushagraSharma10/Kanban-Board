import React, { useState } from "react";
import CardModal from "./CardModal";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  boardId: string;
  columnId: string;
  assignees?: string[];
  label?: "none" | "low" | "moderate" | "high" | "urgent";
}

interface CardProps {
  card: CardData;
  onUpdate: (updatedCard: CardData) => void;
  onDelete: (id: string) => void;
  existingCards?: CardData[];
}

const Card: React.FC<CardProps> = ({ card, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleSave = (updatedCard: CardData) => {
    onUpdate(updatedCard);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-zinc-800 shadow-md rounded-md p-3 mb-2 cursor-pointer hover:bg-zinc-900 transition"
      >
        {card.label && card.label !== "none" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-200">
            {card.label.toUpperCase()}
          </span>
        )}
        <h3 className="font-semibold text-gray-100 truncate">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-gray-300 mt-1">
            {card.description.length > 33
              ? card.description.slice(0, 33) + "..."
              : card.description}
          </p>
        )}
        {card.dueDate && (
          <p className="text-sm text-gray-400 mt-1">Due: {card.dueDate}</p>
        )}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex gap-1 mt-2">
            {card.assignees.slice(0, 3).map((name) => (
              <span
                key={name}
                title={name}
                className="w-6 h-6 rounded-full bg-gray-600 text-white text-[10px] flex items-center justify-center"
              >
                {name.trim().charAt(0).toUpperCase()}
              </span>
            ))}
            {card.assignees.length > 3 && (
              <span className="text-xs text-gray-300">
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
