import React, { useState } from "react";
import type { CardData } from "./Card";

interface CardModalProps {
  card: CardData;
  onSave: (card: CardData) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  existingCards?: CardData[];
}
const MAX_TITLE_LENGTH = 50;

const CardModal: React.FC<CardModalProps> = ({
    card,
    onSave,
    onDelete,
    onClose,
    existingCards = [],
}) => {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || "");
    const [dueDate, setDueDate] = useState(card.dueDate || "");
    const [dateError, setDateError] = useState("");

  const handleSave = () => {
    if (!title.trim()) return;
    if (title.length > MAX_TITLE_LENGTH) {
      alert(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    if (
      existingCards.some(
        (c) =>
          c.id !== card.id &&
          c.title.toLowerCase() === title.toLowerCase()
      )
    ) {
      alert("A card with this title already exists!");
      return;
    }
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      const [year, month, day] = dueDate.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day); 

      if (selectedDate < today) {
        setDateError("Due date cannot be in the past.");
        return;
      }
    }
    setDateError("");
    onSave({ ...card, title, description, dueDate });
    onClose();
  };

  const handleDelete = () => {
    onDelete(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-96 p-6 relative animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Card</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-gray-600 rounded px-3 py-2 mb-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-600 rounded px-3 py-2 mb-3 resize-none bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-gray-600 rounded px-3 py-2 mb-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {dateError && <p className="text-red-400 text-sm mb-2">{dateError}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
