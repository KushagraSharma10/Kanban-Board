import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import Column from "../components/board/Column";
import { useNavigate, useParams } from "react-router";
import {
  ensureDefaultColumns,
  addColumn,
  renameColumn,
  deleteColumn,
  type StoredColumn,
} from "../utils/columns";

import type { ColumnItem } from "../utils/types/board-view";
import { loadFromStorage } from "../utils/storage";
import type { BoardItem } from "../utils/types/dashboard";

const SESSION_STORAGE_KEY = "kanban.session";
const BOARDS_STORAGE_KEY = "kanban.boards";

const BoardView = () => {
  const [boardName, setBoardName] = useState<string>("");
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const activeSession = getSession();
  const activeUserId = activeSession?.userId || null;

  useEffect(() => {
    if (!activeUserId) {
      navigate("/");
      return;
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

  type SessionDataLocal = { userId: string; createdAt: number };

  function getSession(): SessionDataLocal | null {
    const session = loadFromStorage(SESSION_STORAGE_KEY, null);
    return session ?? null;
  }

  function getAllBoards(): BoardItem[] {
    const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
    return (Array.isArray(stored) ? stored : []) as BoardItem[];
  }

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
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              boardId={boardId ?? ""}
              onRename={handleRenameColumn}
              onDelete={handleDeleteColumn}
            />
          ))}

          <div className="min-w-[20vw] max-w-[20vw]">
            {showAdd ? (
              <div className="rounded-md bg-[#161a21] border border-[#3a3f44] md:p-4 ">
                <input
                  ref={inputRef}
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateColumn();
                    if (e.key === "Escape") {
                      setShowAdd(false);
                      setNewColumnName("");
                    }
                  }}
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
    </div>
  );
};

export default BoardView;
