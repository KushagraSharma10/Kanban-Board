import React, { useState } from "react";
import type { CardData } from "./Card";
import Card from "./Card";

interface ColumnProps {
  column: {
    id: string;
    title: string;
    cards: CardData[];
  };
  onRename: (id: string, newTitle: string) => void;
}

const MAX_TITLE_LENGTH = 50;

export default function ColumnTest({ column }: ColumnProps) {
  const [cards, setCards] = useState<CardData[]>(column.cards);
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [error, setError] = useState("");

  const handleAddCard = () => {
    const trimmedTitle = newCardTitle.trim();

    if (!trimmedTitle) {
      setError("Title cannot be empty.");
      return;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setError(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    if (cards.some((c) => c.title.toLowerCase() === trimmedTitle.toLowerCase())) {
      setError("A card with this title already exists!");
      return;
    }

    const newCard: CardData = {
      id: `card-${Date.now()}`,
      title: trimmedTitle,
    };
    setCards([...cards, newCard]);
    setNewCardTitle("");
    setIsAdding(false);
    setError(""); 
  };

  return (
    <div className="min-w-[20vw] max-w-[30vw] bg-[#161a21] rounded-md p-1.5 flex flex-col">
      <div className="flex items-center justify-between mb-2 px-4 py-3">
        <h2 className="text-sm w-full font-medium">{column.title}</h2>
      </div>

      <div className="cards flex flex-col gap-2 px-3 py-2 flex-1 overflow-y-auto">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={(updatedCard) =>
              setCards(cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)))
            }
            onDelete={(id) => setCards(cards.filter((c) => c.id !== id))}
            existingCards={cards}
          />
        ))}
      </div>

<div className="px-3 py-2">
  {!isAdding ? (
    <div
      className="flex items-center gap-1 hover:bg-[#1f2125] hover:cursor-pointer p-3 rounded-md text-sm transition-colors"
      onClick={() => setIsAdding(true)}
    >
      <span className="text-lg leading-none">+</span>
      Add Card
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={newCardTitle}
        onChange={(e) => setNewCardTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddCard();
          if (e.key === "Escape") {
            setIsAdding(false);
            setNewCardTitle("");
            setError("");
          }
        }}
        placeholder="Card title"
        className="px-2 py-1 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleAddCard}
          className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
        >
          Add
        </button>
        <button
          onClick={() => {
            setIsAdding(false);
            setError("");
            setNewCardTitle("");
          }}
          className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>
    </div>
  );
}
