import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ColumnItem } from "../../pages/BoardView";
import type { CardData } from "../card/Card";
import Card from "../card/Card";

type ColumnProps = {
  column: ColumnItem;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
};

const MAX_TITLE_LENGTH = 50;

export default function Column({ column, onRename, onDelete }: ColumnProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(column.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
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
  
      if (
        cards.some((c) => c.title.toLowerCase() === trimmedTitle.toLowerCase())
      ) {
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

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [menuOpen]);

  const commitRename = () => {
    const Title = title.trim();
    if (!Title) {
      setTitle(column.title);
      setEditing(false);
      return;
    }
    onRename(column.id, Title);
    setEditing(false);
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
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setTitle(column.title);
                setEditing(false);
              }
            }}
            onBlur={commitRename}
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
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          />
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-1 w-30 rounded-md bg-[#0f141b] border border-[#263241] shadow-lg z-50 overflow-hidden"
            >
              <button
                role="menuitem"
                className="w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm"
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
              >
                Rename
              </button>
              <button
                role="menuitem"
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
            onUpdate={(updatedCard) =>
              setCards(
                cards.map((c) => (c.id === updatedCard.id ? updatedCard : c))
              )
            }
            onDelete={(id) => setCards(cards.filter((c) => c.id !== id))}
            existingCards={cards}
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
