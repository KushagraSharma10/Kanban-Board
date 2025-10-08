import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Card from "../card/Card";
import { loadFromStorage, saveToStorage } from "../../utils/storage";
import type { ColumnProps } from "../../utils/types/column";
import type { CardData } from "../../utils/interface/card";
import { CARD_KEY } from "../../utils/constants/card";

import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  selectCardsForColumn,
} from "../../app/slices/card.slice";
import { MAX_TITLE_LENGTH } from "../../utils/constants/card-modal";
import { addCardToColumn, deleteCardFromColumn, loadCardsForColumn, updateCardInColumn } from "../../app/thunks/card.thunks";

const Column: React.FC<ColumnProps> = ({
  column,
  onRename,
  onDelete,
  boardId,
  searchText = "",
}: ColumnProps) => {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(column.title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const cards = useAppSelector((state) =>
    selectCardsForColumn(state, column.id)
  );

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newCardTitle, setNewCardTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    dispatch(loadCardsForColumn(column.id));
  }, [dispatch, column.id]);

  useEffect(() => {
    setTitle(column.title);
  }, [column.title]);

  const loadCards = (): CardData[] => {
    return loadFromStorage(CARD_KEY, [] as CardData[]);
  };

  const saveCards = (cards: CardData[]): void => {
    saveToStorage(CARD_KEY, cards);
  };

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
        (existingCard) =>
          existingCard.title.toLowerCase() === trimmedTitle.toLowerCase()
      )
    ) {
      setError("A card with this title already exists!");
      return;
    }
    dispatch(addCardToColumn(boardId, column.id, trimmedTitle));

    setNewCardTitle("");
    setIsAdding(false);
    setError("");
  };

  const normalizedQuery = searchText.trim().toLowerCase();
  const visibleCards = !normalizedQuery
    ? cards
    : cards.filter((card) => {
        const title = card.title.toLowerCase().includes(normalizedQuery);
        const label = (card.label ?? "none")
          .toLowerCase()
          .includes(normalizedQuery);
        const assignee = (card.assignees ?? []).some((assignee) =>
          assignee.toLowerCase().includes(normalizedQuery)
        );
        return title || label || assignee;
      });

  const handleKeyDown = (
    keyboardEvent: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (keyboardEvent.key === "Enter") {
      onRename(column.id, title.trim());
      setEditing(false);
    }
    if (keyboardEvent.key === "Escape") {
      setTitle(column.title);
      setEditing(false);
    }
  };

  const handleBlur = () => {
    onRename(column.id, title.trim());
    setEditing(false);
  };

  const handleRenameClick = () => {
    setMenuOpen(false);
    setEditing(true);
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    onDelete(column.id);
  };

  const menuOptions = [
    {
      label: "Rename",
      action: handleRenameClick,
      className: "w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm",
    },
    {
      label: "Delete",
      action: handleDeleteClick,
      className:
        "w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm text-red-400",
    },
  ];

  const handleNewCardKeyDown = (keyboardEvent: React.KeyboardEvent<HTMLInputElement>) => {
  if (keyboardEvent.key === "Enter") {
    handleAddCard();
  }

  if (keyboardEvent.key === "Escape") {
    setIsAdding(false);
    setNewCardTitle(""); 
    setError("");    
  }
};

const handleCancelCard = () => {
  setIsAdding(false);     
  setError("");           
  setNewCardTitle("");   
};

  return (
    <div className="min-w-[70vw] max-h-max md:min-w-[40vw] lg:min-w-[20vw] bg-[#161a21] rounded-md md:p-1.5 p-1">
      <div className="flex items-center justify-between mb-2 px-4 py-3 ">
        {editing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(changeEvent) => setTitle(changeEvent.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
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
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-30 rounded-md bg-[#222c38] border border-[#3a3f44] shadow-lg z-50 overflow-hidden">
              {menuOptions.map((option) => (
                <button
                  key={option.label}
                  className={option.className}
                  onClick={option.action}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="cards flex flex-col gap-2 px-3 py-1.5">
        {visibleCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={handleCardUpdate}
            onDelete={handleCardDelete}
          />
        ))}
        {normalizedQuery && visibleCards.length === 0 && (
          <div className="text-xs text-[#9ca3af] italic px-2 py-3">
            No matching cards
          </div>
        )}
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
              onChange={(changeEvent) =>
                setNewCardTitle(changeEvent.target.value)
              }
              onKeyDown={handleNewCardKeyDown}
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
                onClick={handleCancelCard}
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
