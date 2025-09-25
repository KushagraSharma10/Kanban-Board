import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Card from "../card/Card";
import { loadCards, saveCards } from "../../utils/storage";
import { nanoid } from "nanoid";
import type { ColumnProps } from "../../utils/types/column";
import type { CardData } from "../../utils/interface/card";

const MAX_TITLE_LENGTH = 15;

const Column: React.FC<ColumnProps> = ({
  column,
  onRename,
  onDelete,
  boardId,
}: ColumnProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const allCards = loadCards();
    const filtered = allCards.filter(
      (card) => card.boardId === boardId && card.columnId === column.id
    );
    setCards(filtered);
  }, [boardId, column.id]);

  useEffect(() => {
    setTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing]);

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
    if (
      cards.some(
        (card) => card.title.toLowerCase() === trimmedTitle.toLowerCase()
      )
    ) {
      setError("A card with this title already exists!");
      return;
    }
    const newCard: CardData = {
      id: nanoid(),
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
            className="text-sm font-medium w-full bg-transparent outline-none border-b border-transparent focus:border-[#3a3f44] pb-0.5 text-[#e6edf3] placeholder-[#9e9e9e]"
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
            <div className="absolute right-0 mt-1 w-30 rounded-md bg-[#222c38] border border-[#3a3f44] shadow-lg z-50 overflow-hidden">
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
            onUpdate={(updatedCard: CardData) => {
              const allCards = loadCards();
              const updatedAll = allCards.map((card) =>
                card.id === updatedCard.id ? updatedCard : card
              );
              saveCards(updatedAll);
              setCards((prev) =>
                prev.map((card) =>
                  card.id === updatedCard.id ? updatedCard : card
                )
              );
            }}
            onDelete={(id: CardData["id"]) => {
              const allCards = loadCards().filter((card) => card.id !== id);
              saveCards(allCards);
              setCards((prev) => prev.filter((card) => card.id !== id));
            }}
          />
        ))}
      </div>

      <div className="px-1">
        {!isAdding ? (
          <div
            className="flex items-center gap-1 hover:bg-[#222c38] hover:cursor-pointer p-3 rounded-md text-sm transition-colors"
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
              className="px-2 py-1 rounded bg-zinc-900 text-white placeholder-zinc-600 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="px-3 py-1 rounded bg-[#0096ff] text-sm text-black hover:bg-[#6ca0ff] transition"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setError("");
                  setNewCardTitle("");
                }}
                className="px-3 py-1 rounded bg-[#222c38] text-sm text-[#e6edf3] border border-[#3a3f44] hover:brightness-110 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
