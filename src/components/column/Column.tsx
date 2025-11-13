import { useState, useRef, useEffect, useCallback } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Card from "../card/Card";
import type { ColumnProps } from "../../utils/types/column";
import type { CardData } from "../../utils/interface/card";

import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { selectCardsForColumn } from "../../app/slices/card.slice";
import { MAX_COLUMN_NAME_LENGTH } from "../../utils/constants/column";
import {
  addCardToColumnOnServer,
  deleteCardFromColumnOnServer,
  loadCardsForColumnFromServer,
  updateCardInColumnOnServer,
} from "../../app/thunks/card.thunks";
import DeleteConfirmation from "../DeleteConfirmation";
import { isBoardAdmin } from "../../lib/permissions";
import { toast } from "react-toastify";

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
  const [renameError, setRenameError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const cards = useAppSelector(
    useCallback((state) => selectCardsForColumn(state, column.id), [column.id])
  );

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newCardTitle, setNewCardTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isConfirmingDeletion, setIsConfirmingDeletion] =
    useState<boolean>(false);

  useEffect(() => {
    if (boardId) dispatch(loadCardsForColumnFromServer(boardId, column.id));
  }, [dispatch, boardId, column.id]);

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

  const handleAddCard = async () => {
    const allowed = await isBoardAdmin(boardId);
    if (!allowed) {
      toast.error("Only admins can add cards on this board");
      return;
    }

    const trimmedTitle = newCardTitle.trim();
    if (!trimmedTitle) {
      setError("Title cannot be empty.");
      return;
    }
    if (trimmedTitle.length > MAX_COLUMN_NAME_LENGTH) {
      setError(`Title cannot exceed ${MAX_COLUMN_NAME_LENGTH} characters.`);
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
    dispatch(addCardToColumnOnServer(boardId, column.id, trimmedTitle));

    setNewCardTitle("");
    setIsAdding(false);
    setError("");
  };

  const normalizedQuery = searchText.trim().toLowerCase();
  const visibleCards = !normalizedQuery
    ? cards
    : cards.filter((card) => {
        const matchesTitle = card.title.toLowerCase().includes(normalizedQuery);
        const matchesLabel = (card.label ?? "none")
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesAssignee = (card.assigneeEmail ?? "")
          .toLowerCase()
          .includes(normalizedQuery);

        return matchesTitle || matchesLabel || matchesAssignee;
      });

  const handleKeyDown = (
    keyboardEvent: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (keyboardEvent.key === "Enter") {
      const trimmed = title.trim();
      if (!trimmed) {
        setRenameError("Column name cannot be empty.");
        return;
      }
      if (trimmed.length < 2) {
        setRenameError("Column name must be at least 2 characters.");
        return;
      }
      if (trimmed.length > MAX_COLUMN_NAME_LENGTH) {
        setRenameError(
          `Column name cannot exceed ${MAX_COLUMN_NAME_LENGTH} characters.`
        );
        return;
      }
      if (trimmed === column.title) {
        setEditing(false);
        return;
      }
      setRenameError("");
      onRename(column.id, trimmed);
      setEditing(false);
    }
    if (keyboardEvent.key === "Escape") {
      setTitle(column.title);
      setEditing(false);
    }
  };

  const handleBlur = async () => {
    const trimmed = title.trim(); 
    if (!trimmed || trimmed === column.title) {
      setTitle(column.title);
      setRenameError("");
      setEditing(false);
      return;
    }
    if (trimmed.length < 2 || trimmed.length > MAX_COLUMN_NAME_LENGTH) {
      setTitle(column.title);
      setRenameError("");
      setEditing(false);
      return;
    }
    setRenameError("");
    const allowed = await isBoardAdmin(boardId);
    if (!allowed) {
      toast.error("Only admins can rename columns");
      setEditing(false);
      return;
    }
    onRename(column.id, trimmed);
    setEditing(false);
  };

  const handleRenameClick = async () => {
    const allowed = await isBoardAdmin(boardId);
    if (!allowed) {
      toast.error("Only admins can rename columns");
      return;
    }
    setMenuOpen(false);
    setRenameError("");
    setEditing(true);
  };

  const handleDeleteColumnClick = async (): Promise<void> => {
    const allowed = await isBoardAdmin(boardId);
    if (!allowed) {
      toast.error("Only admins can delete columns");
      return;
    }
    setMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDeletion = (): void => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDeletion = async (): Promise<void> => {
    try {
      setIsConfirmingDeletion(true);
      onDelete(column.id);
    } finally {
      setIsConfirmingDeletion(false);
      setIsDeleteModalOpen(false);
    }
  };

  const menuOptions = [
    {
      label: "Rename",
      action: handleRenameClick,
      className: "w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm",
    },
    {
      label: "Delete",
      action: handleDeleteColumnClick,
      className:
        "w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm text-red-400",
    },
  ];

  const handleNewCardKeyDown = (
    keyboardEvent: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
    setNewCardTitle(""); 
    setError("");    
  }

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMenuToggle();
    }
  };

  return (
    <div className="min-w-[70vw] max-h-max md:min-w-[40vw] lg:min-w-[20vw] bg-theme-column rounded-md md:p-1.5 p-1">
      <div className="flex items-center justify-between mb-2 px-4 py-3 ">
        {editing ? (
          <input 
            ref={inputRef}
            value={title}
            onChange={(changeEvent) => setTitle(changeEvent.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="text-sm font-medium w-full bg-transparent outline-none border-b border-transparent focus:border-theme-borderMuted pb-0.5 text-theme-primary placeholder:text-theme-placeholder"
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
        {editing && renameError && (
          <p className="mt-1 text-xs text-red-400">{renameError}</p>
        )}
        <div className="relative" ref={menuRef}>
          <BsThreeDotsVertical
            className="hover:cursor-pointer opacity-80"
            onClick={handleMenuToggle}
            onKeyDown={handleMenuKeyDown}
            aria-label="Column options menu"
            role="button"
            tabIndex={0}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-[var(--size-menu)] rounded-md bg-theme-popover border border-theme-borderMuted shadow-lg z-50 overflow-hidden">
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
            onUpdate={(updatedCard: CardData) => {
              dispatch(
                updateCardInColumnOnServer(boardId, column.id, updatedCard)
              );
            }}
            onDelete={(cardId: CardData["id"]) => {
              dispatch(
                deleteCardFromColumnOnServer(boardId, column.id, cardId)
              );
            }}
          />
        ))}
        {normalizedQuery && !visibleCards.length && (
          <div className="text-xs text-theme-muted italic px-2 py-3">
            No matching cards
          </div>
        )}
      </div>

      <div className="px-1">
        {!isAdding ? (
          <div
            className="flex items-center gap-1 hover:bg-theme-popover hover:cursor-pointer p-3 rounded-md text-sm transition-colors"
            onClick={async () => {
              const allowed = await isBoardAdmin(boardId);
              if (!allowed) {
                toast.error("Only admins can add cards on this board");
                return;
              }
              setIsAdding(true);
            }}
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
              className="px-2 py-1 rounded bg-theme-surfaceMuted text-theme-primary placeholder:text-theme-placeholder border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-accent/70"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="px-3 py-1 rounded bg-theme-primaryButton text-sm text-black hover:bg-theme-primaryButtonHover transition"
              >
                Add
              </button>
              <button
                onClick={handleCancelCard}
                className="px-3 py-1 rounded bg-theme-popover text-sm text-theme-primary border border-theme-borderMuted hover:brightness-110 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        itemName={column.title}
        onCancel={handleCancelDeletion}
        onConfirm={handleConfirmDeletion}
        isConfirming={isConfirmingDeletion}
      />
    </div>
  );
}

export default Column;
