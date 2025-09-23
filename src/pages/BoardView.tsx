import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import Column from "../components/board/Column";
import { useNavigate, useParams } from "react-router";
import { getSession } from "../services/session";
import { getAllBoards } from "../services/boards";
import {
  ensureDefaultColumns,
  addColumn,
  renameColumn,
  deleteColumn,
  type StoredColumn,
} from "../utils/columns";

export type ColumnItem = { id: string; title: string };

const BoardView = () => {
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
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

  return (
    <div className="w-full min-h-screen text-white bg-[#0b0f14]">
      <header className="p-6 border-b border-[#222c38] flex items-center justify-between">
        <h1 className="text-xl font-semibold">Board</h1>
        <button
          onClick={() => setShowAdd((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1a1f27] hover:bg-[#222834] border border-[#263241]"
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
              <div className="rounded-md bg-[#161a21] border border-[#171a1f] p-4">
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
                  maxLength={24}
                  className="w-full rounded-md text-sm border border-[#2d2e31] px-3 py-2 outline-none"
                  placeholder="Column name"
                />
                <div className="mt-2 flex items-center">
                  <button
                    onClick={handleCreateColumn}
                    disabled={!newColumnName.trim()}
                    className="px-3 py-1.5 rounded-md bg-[#1a4fff] text-sm hover:bg-[#1745e0] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAdd(false);
                      setNewColumnName("");
                    }}
                    className="ml-auto px-3 py-2 rounded-md hover:bg-[#141b26] border border-transparent"
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
                className="w-full py-3 flex items-center justify-center gap-2 rounded-md border border-dashed border-[#2b3647] bg-[#121824]/60 hover:bg-[#1a1f27] text-sm"
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
