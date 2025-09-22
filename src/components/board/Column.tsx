import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ColumnItem } from "../../pages/BoardView";
import type { CardData } from "../card/Card";
import Card from "../card/Card";
import { loadCards, saveCards } from "../../utils/storage";

export type ColumnProps = {
  column: ColumnItem;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  boardId: string;
};

const MAX_TITLE_LENGTH = 50;

export default function Column({ column, onRename, onDelete, boardId }: ColumnProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const allCards = loadCards();
    const filtered = allCards.filter(
      (c) => c.boardId === boardId && c.columnId === column.id
    );
    setCards(filtered);
  }, [boardId, column.id]);

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
      boardId,
      columnId: column.id,
    };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    const allCards = loadCards();
    saveCards([...allCards, newCard]);
    setNewCardTitle("");
    setIsAdding(false);
    setError("");
  };

  return (
    <div className="min-w-[70vw] max-h-max md:min-w-[40vw] lg:min-w-[20vw] bg-[#161a21] rounded-md md:p-1.5 p-1">
      <div className="flex items-center justify-between mb-2 px-4 py-3 ">
        {editing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRename(column.id, title.trim());
                setEditing(false);
              }
              if (e.key === "Escape") {
                setTitle(column.title);
                setEditing(false);
              }
            }}
            onBlur={() => {
              onRename(column.id, title.trim());
              setEditing(false);
            }}
            className="text-sm font-medium w-full bg-transparent outline-none border-b border-transparent focus:border-[#2b3647] pb-0.5"
            placeholder="Column name"
          />
        ) : (
          <h2
            className="text-sm w-full font-medium"
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
          >
            {column.title}
          </h2>
        )}

        <div className="relative" ref={menuRef}>
          <BsThreeDotsVertical
            className="hover:cursor-pointer opacity-80"
            onClick={() => setMenuOpen((s) => !s)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-30 rounded-md bg-[#0f141b] border border-[#263241] shadow-lg z-50 overflow-hidden">
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm"
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
              >
                Rename
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm text-red-400"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(column.id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="cards flex flex-col gap-2 px-3 py-1.5">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={(updatedCard) => {
              const allCards = loadCards();
              const updatedAll = allCards.map((c) =>
                c.id === updatedCard.id ? updatedCard : c
              );
              saveCards(updatedAll);
              setCards((prev) =>
                prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
              );
            }}
            onDelete={(id) => {
              const allCards = loadCards().filter((c) => c.id !== id);
              saveCards(allCards);
              setCards((prev) => prev.filter((c) => c.id !== id));
            }}
          />
        ))}
      </div>

      <div className="px-1">
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
