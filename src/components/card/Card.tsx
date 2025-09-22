import React, { useState } from "react";
import CardModal from "./CardModal";

export interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  boardId: string;
  columnId: string;
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
        className="bg-gray-800 shadow-md rounded-md p-3 mb-2 cursor-pointer hover:bg-gray-700 transition"
        >
        <h3 className="font-semibold text-gray-100 truncate">{card.title}</h3>
        {card.dueDate && (
            <p className="text-sm text-gray-400 mt-1">Due: {card.dueDate}</p>
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
