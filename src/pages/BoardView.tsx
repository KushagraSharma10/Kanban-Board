import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import Column from "../components/board/Column";
import { useNavigate, useParams } from "react-router";
import type { ColumnItem } from "../utils/types/board-view";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import type { BoardItem } from "../utils/types/dashboard";
import { saveBoardColumnOrder } from "../utils/order-storage";
import { getDragData, reorderById, setDragData } from "../utils/drag-and-drop";
import { nanoid } from "nanoid";
import { COLUMNS_KEY } from "../utils/constants/column";
import { BOARDS_STORAGE_KEY } from "../utils/constants/board";
import type { StoredColumn } from "../utils/types/column";
import { getSession } from "../utils/session";
import LoginPrompt from "../components/LoginPrompt";

const BoardView = () => {
  const [boardName, setBoardName] = useState<string>("");
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const draggingColumnIdRef = useRef<string | null>(null);

  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const activeSession = getSession();
  const activeUserId = activeSession?.userId || null;

  useEffect(() => {
    if (!activeUserId) {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    const board = getAllBoards().find(
      (board) => board.id === boardId && board.userId === activeUserId
    );

    if (!board) {
      navigate("/dashboard");
      return;
    }

    setBoardName(board.name);
    const seeded = ensureDefaultColumns(board.id);
    setColumns(seeded.map(({ id, title }) => ({ id, title })));
  }, [activeUserId, boardId, navigate]);

  useEffect(() => {
    if (showAdd) inputRef.current?.focus();
  }, [showAdd]);

  const handleCreateColumn = () => {
    if (!boardId) return;
    const updated: StoredColumn[] = addColumn(boardId, newColumnName);
    setColumns(updated.map(({ id, title }) => ({ id, title })));
    setNewColumnName("");
    setShowAdd(false);
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    if (!boardId) return;
    const updated = renameColumn(boardId, columnId, newTitle);
    setColumns(updated.map(({ id, title }) => ({ id, title })));
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!boardId) return;
    const updated = deleteColumn(boardId, columnId);
    setColumns(updated.map(({ id, title }) => ({ id, title })));
  };

  const handleColumnDragStart = (
    columnId: string,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    draggingColumnIdRef.current = columnId;
    setDragData(event, { id: columnId });
  };

  const handleColumnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  const handleColumnDropBefore = (
    targetColumnId: string,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const payload = getDragData(event);
    const sourceColumnId = draggingColumnIdRef.current || payload?.id;
    if (!sourceColumnId || sourceColumnId === targetColumnId) return;

    setColumns((previousColumns) => {
      const sourceIndex = previousColumns.findIndex(
        (col) => col.id === sourceColumnId
      );
      const targetIndex = previousColumns.findIndex(
        (col) => col.id === targetColumnId
      );
      if (sourceIndex === -1 || targetIndex === -1) return previousColumns;

      const position: "before" | "after" =
        sourceIndex < targetIndex ? "after" : "before";

      const nextColumns = reorderById(
        previousColumns,
        sourceColumnId,
        targetColumnId,
        position
      );

      if (boardId) {
        saveBoardColumnOrder(
          boardId,
          nextColumns,
          loadColumnsForBoard,
          saveColumnsForBoard
        );
      }
      return nextColumns;
    });

    draggingColumnIdRef.current = null;
  };

  function getAllBoards(): BoardItem[] {
    const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
    return (Array.isArray(stored) ? stored : []) as BoardItem[];
  }

  function loadAllColumns(): StoredColumn[] {
    return loadFromStorage(COLUMNS_KEY, [] as StoredColumn[]);
  }

  function saveAllColumns(columns: StoredColumn[]): void {
    saveToStorage(COLUMNS_KEY, columns);
  }

  function loadColumnsForBoard(boardId: string): StoredColumn[] {
    return loadAllColumns().filter((column) => column.boardId === boardId);
  }

  function saveColumnsForBoard(
    boardId: string,
    nextColumns: StoredColumn[]
  ): void {
    const all = loadAllColumns().filter((column) => column.boardId !== boardId);
    saveAllColumns([...all, ...nextColumns]);
  }

  function ensureDefaultColumns(boardId: string): StoredColumn[] {
    const existing = loadColumnsForBoard(boardId);
    if (existing.length > 0) return existing;

    const now = Date.now();
    const defaults: StoredColumn[] = [
      { id: nanoid(), boardId, title: "To Do", createdAt: now },
      { id: nanoid(), boardId, title: "In Progress", createdAt: now },
      { id: nanoid(), boardId, title: "Done", createdAt: now },
    ];

    const all = loadAllColumns();
    saveAllColumns([...all, ...defaults]);
    return defaults;
  }

  function addColumn(boardId: string, titleRaw: string): StoredColumn[] {
    const title = titleRaw.trim();
    if (!title) return loadColumnsForBoard(boardId);

    const current = loadColumnsForBoard(boardId);
    const duplicate = current.some(
      (column) => column.title.toLowerCase() === title.toLowerCase()
    );
    if (duplicate) return current;

    const newCol: StoredColumn = {
      id: nanoid(),
      boardId,
      title,
      createdAt: Date.now(),
    };
    const updated = [...current, newCol];
    saveColumnsForBoard(boardId, updated);
    return updated;
  }

  function renameColumn(
    boardId: string,
    columnId: string,
    newTitleRaw: string
  ): StoredColumn[] {
    const newTitle = newTitleRaw.trim();
    if (!newTitle) return loadColumnsForBoard(boardId);

    const current = loadColumnsForBoard(boardId);
    const duplicate = current.some(
      (column) =>
        column.id !== columnId &&
        column.title.toLowerCase() === newTitle.toLowerCase()
    );
    if (duplicate) return current;

    const updated = current.map((column) =>
      column.id === columnId ? { ...column, title: newTitle } : column
    );
    saveColumnsForBoard(boardId, updated);
    return updated;
  }

  function deleteColumn(boardId: string, columnId: string): StoredColumn[] {
    const updated = loadColumnsForBoard(boardId).filter(
      (column) => column.id !== columnId
    );
    saveColumnsForBoard(boardId, updated);
    return updated;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreateColumn();
    if (e.key === "Escape") {
      setShowAdd(false);
      setNewColumnName("");
    }
  };

  return (
    <div className="w-full min-h-screen text-[#e6edf3] bg-[#0b0f14]">
      <header className="p-6 border-b border-[#3a3f44] flex items-center justify-between">
        <h1 className="text-xl font-semibold">{boardName || "Board"}</h1>
        <button
          onClick={() => setShowAdd((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#222c38] hover:brightness-110 border border-[#3a3f44]"
        >
          <GoPlus className="text-lg" />
          Add Column
        </button>
      </header>

      <div className="w-full min-h-[90vh] overflow-auto">
        <div className="flex gap-4 p-4 min-w-max">
          {columns.map((columnItem) => (
            <div
              key={columnItem.id}
              draggable
              onDragStart={(event) =>
                handleColumnDragStart(columnItem.id, event)
              }
              onDragOver={handleColumnDragOver}
              onDrop={(event) => handleColumnDropBefore(columnItem.id, event)}
              onDragEnd={() => (draggingColumnIdRef.current = null)}
              className="min-w-[70vw] md:min-w-[40vw] lg:min-w-[20vw] rounded-md border border-transparent transition-colors "
              title="Drag to reorder"
            >
              <Column
                column={columnItem}
                boardId={boardId ?? ""}
                onRename={handleRenameColumn}
                onDelete={handleDeleteColumn}
              />
            </div>
          ))}

          <div className="min-w-[20vw] max-w-[20vw]">
            {showAdd ? (
              <div className="rounded-md bg-[#161a21] border border-[#3a3f44] md:p-4 ">
                <input
                  ref={inputRef}
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={15}
                  className="w-full rounded-md text-sm border border-[#3a3f44] bg-[#222c38] px-3 py-2 outline-none placeholder-[#9e9e9e]"
                  placeholder="Column name"
                />
                <div className="mt-2 flex items-center">
                  <button
                    onClick={handleCreateColumn}
                    disabled={!newColumnName.trim()}
                    className="px-3 py-1.5 rounded-md bg-[#0096ff] text-sm text-black hover:bg-[#6ca0ff] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAdd(false);
                      setNewColumnName("");
                    }}
                    className="ml-auto px-3 py-2 rounded-md hover:bg-[#222c38] border border-transparent"
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
                className="w-fit px-4 md:w-full py-3 flex items-center justify-center gap-2 rounded-md border border-dashed border-[#3a3f44] bg-[#161a21]/60 hover:bg-[#161a21] text-sm"
                title="Add column"
              >
                <GoPlus className="text-lg" />
                Add Column
              </button>
            )}
          </div>
        </div>
      </div>
      <LoginPrompt isOpen={showLogin} onLoginClick={() => navigate("/login")} />
    </div>
  );
};

export default BoardView;
