import { useState, useRef, useEffect } from "react";
import Column from "../components/board/Column";
import { GoPlus } from "react-icons/go";
import { nanoid } from "nanoid";
import { useNavigate, useParams } from "react-router";
import { getSession } from "../services/session";
import { getAllBoards } from "../services/boards";
import { loadColumns, saveColumns } from "../utils/storage";
import type { ColumnItem } from "../types/board-view";

const BoardView = () => {
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newColName, setNewColName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const activeSession = getSession();
  const activeUserId = activeSession?.userId || null;

  const [currentBoard, setCurrentBoard] = useState<{ id: string; userId: string } | null>(null);

  useEffect(() => {
    if (!activeUserId) {
      navigate("/");
      return;
    }
    const board = getAllBoards().find(
      (board) => board.id === boardId && board.userId === activeUserId
    );
    if (!board) navigate("/dashboard");
    else {
      setCurrentBoard(board);
      const savedColumns = loadColumns(board.id);
      if (savedColumns.length) setColumns(savedColumns);
      else {
        const defaultCols: ColumnItem[] = [
          { id: nanoid(), title: "To Do" },
          { id: nanoid(), title: "In Progress" },
          { id: nanoid(), title: "Done" },
        ];
        setColumns(defaultCols);
        saveColumns(board.id, defaultCols);
      }
    }
  }, [activeUserId, boardId, navigate]);

  const renameColumn = (id: string, newTitle: string) => {
    const title = newTitle.trim();
    if (!title) return;
    const updated = columns.map((column) =>
      column.id === id ? { ...column, title } : column
    );
    setColumns(updated);
    if (currentBoard) saveColumns(currentBoard.id, updated);
  };

  const deleteColumn = (id: string) => {
    const updated = columns.filter((column) => column.id !== id);
    setColumns(updated);
    if (currentBoard) saveColumns(currentBoard.id, updated);
  };

  const handleCreateColumn = () => {
    const name = newColName.trim();
    if (!name) return;
    const exists = columns.some((c) => c.title.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert("Column with this name already exists!");
      return;
    }
    const newColumn = { id: nanoid(), title: name };
    const updated = [...columns, newColumn];
    setColumns(updated);
    setNewColName("");
    setShowAdd(false);
    if (currentBoard) saveColumns(currentBoard.id, updated);
  };

  useEffect(() => {
    if (showAdd) inputRef.current?.focus();
  }, [showAdd]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleCreateColumn();
    if (e.key === "Escape") {
      setShowAdd(false);
      setNewColName("");
    }
  };

  return (
    <div className="w-full min-h-screen text-white bg-[#0b0f14]">
      <header className="p-6 border-b border-[#222c38] flex items-center justify-between">
        <h1 className="text-xl font-semibold">Board</h1>
        <button
          onClick={() => setShowAdd((s) => !s)}
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
              boardId={currentBoard?.id ?? ""}
              onRename={renameColumn}
              onDelete={deleteColumn}
            />
          ))}

          <div className="min-w-[20vw] max-w-[20vw]">
            {showAdd ? (
              <div className="rounded-md bg-[#161a21] border border-[#171a1f] p-4">
                <input
                  ref={inputRef}
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={15}
                  className="w-full rounded-md text-sm border border-[#2d2e31] px-3 py-2 outline-none"
                  placeholder="Column name"
                />
                <div className="mt-2 flex items-center">
                  <button
                    onClick={handleCreateColumn}
                    disabled={!newColName.trim()}
                    className="px-3 py-1.5 rounded-md bg-[#1a4fff] text-sm hover:bg-[#1745e0] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAdd(false);
                      setNewColName("");
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
