import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import Column from "../components/column/Column";
import { useNavigate, useParams } from "react-router";
import type { ColumnItem } from "../utils/types/board-view";
import { getDragData, reorderById, setDragData } from "../utils/drag-and-drop";
import { getSession } from "../utils/session";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { selectColumnItemsForBoard } from "../app/slices/column.slice";
import {
  applyColumnOrder,
  createColumn,
  deleteColumnThunk,
  renameColumnThunk,
  SeedColumnsForBoard,
} from "../app/thunks/columns.thunks";
import { readAllBoards } from "../app/thunks/board.thunks";
import { validateColumnTitle } from "../utils/column";
import { MAX_COLUMN_NAME_LENGTH } from "../utils/constants/column";

const BoardView: React.FC = () => {
  const [boardName, setBoardName] = useState<string>("");
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cardSearch, setCardSearch] = useState<string>("");
  const [columnNameError, setColumnNameError] = useState<string>("");

  const draggingColumnIdRef = useRef<string | null>(null);

  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activeSession = getSession();
  const activeUserId = activeSession?.userId || null;

  const columns: ColumnItem[] = useAppSelector((state) =>
    selectColumnItemsForBoard(state, boardId ?? "")
  );

  useEffect(() => {
    if (!activeUserId) return;

    const board = readAllBoards().find(
      (candidateBoard) =>
        candidateBoard.id === boardId && candidateBoard.userId === activeUserId
    );

    if (!board) {
      navigate("/");
      return;
    }
    setBoardName(board.name);
  }, [activeUserId, boardId]);

  useEffect(() => {
    if (!boardId) return;
    if (!columns.length) {
      dispatch(SeedColumnsForBoard(boardId));
    }
  }, [dispatch, boardId, columns.length]);

  useEffect(() => {
    if (showAdd) inputRef.current?.focus();
  }, [showAdd]);

  const handleCreateColumn = () => {
    if (!boardId) return;

    const validation = validateColumnTitle(boardId, newColumnName);

    if (!validation.isValid) {
      setColumnNameError(validation.error ?? "Invalid column name.");
      return;
    }

    setColumnNameError("");
    dispatch(createColumn(boardId, validation.title));
    setNewColumnName("");
    setShowAdd(false);
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    if (!boardId) return;
    dispatch(renameColumnThunk(boardId, columnId, newTitle));
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!boardId) return;
    dispatch(deleteColumnThunk(boardId, columnId));
  };

  const handleColumnDragStart = (
    columnId: string,
    dragEvent: React.DragEvent<HTMLDivElement>
  ) => {
    draggingColumnIdRef.current = columnId;
    setDragData(dragEvent, { id: columnId });
  };

  const handleColumnDragOver = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    dragEvent.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (
    targetColumnId: string,
    dragEvent: React.DragEvent<HTMLDivElement>
  ) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    const draggedColumn = getDragData(dragEvent);
    const sourceColumnId = draggingColumnIdRef.current || draggedColumn?.id;
    if (!sourceColumnId || sourceColumnId === targetColumnId) return;

    const nextColumns: ColumnItem[] = (() => {
      const sourceIndex = columns.findIndex(
        (column) => column.id === sourceColumnId
      );
      const targetIndex = columns.findIndex(
        (column) => column.id === targetColumnId
      );
      if (sourceIndex === -1 || targetIndex === -1) return columns;

      const position: "before" | "after" =
        sourceIndex < targetIndex ? "after" : "before";

      return reorderById(columns, sourceColumnId, targetColumnId, position);
    })();

    if (boardId) {
      dispatch(applyColumnOrder(boardId, nextColumns));
    }

    draggingColumnIdRef.current = null;
  };

  const handleColumnInputKeyDown = (
    keyboardEvent: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (keyboardEvent.key === "Enter") {
      handleCreateColumn();
    }
    if (keyboardEvent.key === "Escape") {
      setShowAdd(false);
      setNewColumnName("");
    }
  };

  const handleCancelAddColumn = () => {
    setShowAdd(false);
    setNewColumnName("");
    setColumnNameError("");
  };

  return (
    <div className="w-full min-h-screen text-theme-primary bg-theme-page">
      <header className="p-4 md:p-6 border-b border-theme-border bg-theme-surface flex items-center gap-3 md:gap-4 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <img src="../public/Kanban.svg" alt="photo" className="w-9 h-9" />
          <h1 className="text-base md:text-xl font-semibold text-theme-primary">
            {boardName || "Board"}
          </h1>
        </div>
        <input
          value={cardSearch}
          onChange={(e) => setCardSearch(e.target.value)}
          placeholder="Search cards (title, label, assignee)…"
          className="flex-1 max-w-[var(--size-theme-search)] px-3 py-2 rounded-md bg-theme-page border border-theme-border outline-none placeholder:text-theme-placeholder focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accentHover"
        />
        <button
          onClick={() => setShowAdd((previous) => !previous)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-theme-surfaceMuted hover:brightness-110 border border-theme-border text-theme-primary"
        >
          <GoPlus className="text-lg" />
          Add Column
        </button>
      </header>

      <div className="w-full min-h-[var(--size-theme-board)] overflow-auto">
        <div className="flex gap-4 p-4 md:p-6 min-w-max">
          {columns.map((columnItem) => (
            <div
              key={columnItem.id}
              draggable
              onDragStart={(dragEvent) =>
                handleColumnDragStart(columnItem.id, dragEvent)
              }
              onDragOver={handleColumnDragOver}
              onDrop={(dragEvent) => handleColumnDrop(columnItem.id, dragEvent)}
              onDragEnd={() => (draggingColumnIdRef.current = null)}
              className="min-w-[var(--size-col-lg)] md:min-w-[var(--size-col-md)] lg:min-w-[var(--size-col-sm)] h-fit rounded-lg border border-theme-border bg-theme-surface transition-colors hover:border-theme-borderHover/40"
              title="Drag to reorder"
            >
              <Column
                column={columnItem}
                boardId={boardId ?? ""}
                onRename={handleRenameColumn}
                onDelete={handleDeleteColumn}
                searchText={cardSearch}
              />
            </div>
          ))}
          <div className="min-w-[var(--size-col-sm)] max-w-[var(--size-col-sm)]">
            {showAdd ? (
              <div className="rounded-lg bg-theme-surface border border-theme-border p-3 md:p-4 shadow-theme-outline">
                <input
                  ref={inputRef}
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={handleColumnInputKeyDown}
                  maxLength={MAX_COLUMN_NAME_LENGTH}
                  className={`w-full rounded-md text-sm border px-3 py-2 outline-none placeholder:text-theme-placeholder
              bg-theme-surfaceMuted border-theme-border focus:border-theme-accentHover focus:ring-2 focus:ring-theme-accent/30
              ${columnNameError ? "border-red-500 focus:ring-red-500/30" : ""}`}
                  placeholder="Column name"
                />
                {columnNameError && (
                  <p className="mt-2 text-xs text-red-400">{columnNameError}</p>
                )}
                <div className="mt-3 flex items-center">
                  <button
                    onClick={handleCreateColumn}
                    disabled={!newColumnName.trim()}
                    className="px-3 py-1.5 rounded-md bg-theme-accent text-sm text-black hover:bg-theme-accentHover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancelAddColumn}
                    className="ml-auto px-3 py-2 rounded-md border border-transparent text-theme-primary hover:bg-theme-overlay/30"
                    aria-label="Close"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                className="w-fit px-4 md:w-full py-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-theme-border bg-theme-surface/60 hover:bg-theme-surface text-sm text-theme-primary"
                title="Add column"
              >
                <GoPlus className="text-lg" />
                Add Column
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
