import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import Column from "../components/board/Column";
import { useNavigate, useParams } from "react-router";
import type { ColumnItem } from "../utils/types/board-view";
import { loadFromStorage } from "../utils/storage";
import type { BoardItem } from "../utils/types/dashboard";
import { getDragData, reorderById, setDragData } from "../utils/drag-and-drop";
import { getSession } from "../utils/session";
import { BOARDS_STORAGE_KEY } from "../utils/constants/board";
import LoginPrompt from "../components/LoginPrompt";

// ✅ NEW: Redux hooks + column slice imports
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  applyColumnOrder,
  createColumn,
  deleteColumnThunk,
  loadOrSeedColumnsForBoard,
  renameColumnThunk,
  selectColumnItemsForBoard,
} from "../features/columns/column-slice";

const BoardView: React.FC = () => {
  const [boardName, setBoardName] = useState<string>("");
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [cardSearch, setCardSearch] = useState<string>("");

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
    if (!activeUserId) {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    const board = getAllBoards().find(
      (candidateBoard) => candidateBoard.id === boardId && candidateBoard.userId === activeUserId
    );

    if (!board) {
      navigate("/dashboard");
      return;
    }
    setBoardName(board.name);
    if (boardId) {
      dispatch(loadOrSeedColumnsForBoard(boardId));
    }
  }, [activeUserId, boardId, navigate, dispatch]);

  useEffect(() => {
    if (showAdd) inputRef.current?.focus();
  }, [showAdd]);

  const handleCreateColumn = () => {
    if (!boardId) return;
    dispatch(createColumn(boardId, newColumnName));
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

  const handleColumnDropBefore = (
    targetColumnId: string,
    dragEvent: React.DragEvent<HTMLDivElement>
  ) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    const payload = getDragData(dragEvent);
    const sourceColumnId = draggingColumnIdRef.current || payload?.id;
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

  function getAllBoards(): BoardItem[] {
    const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
    return (Array.isArray(stored) ? stored : []) as BoardItem[];
  }

  return (
    <div className="w-full min-h-screen text-[#e6edf3] bg-[#0b0f14]">
      <header className="p-6 border-b border-[#3a3f44] flex items-center justify-between">
        <h1 className="text-xl font-semibold">{boardName || "Board"}</h1>
         <input
          value={cardSearch}
          onChange={(e) => setCardSearch(e.target.value)}
          placeholder="Search cards (title, label, assignee)…"
          className="flex-1 max-w-[420px] px-3 py-2 rounded-md bg-[#0b0f14] border border-[#3a3f44] outline-none placeholder-[#9e9e9e]"
        />
        <button
          onClick={() => setShowAdd((previous) => !previous)}
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
              onDragStart={(dragEvent) =>
                handleColumnDragStart(columnItem.id, dragEvent)
              }
              onDragOver={handleColumnDragOver}
              onDrop={(dragEvent) => handleColumnDropBefore(columnItem.id, dragEvent)}
              onDragEnd={() => (draggingColumnIdRef.current = null)}
              className="min-w-[70vw] md:min-w-[40vw] lg:min-w-[20vw] rounded-md border border-transparent transition-colors "
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

          <div className="min-w-[20vw] max-w-[20vw]">
            {showAdd ? (
              <div className="rounded-md bg-[#161a21] border border-[#3a3f44] md:p-4 ">
                <input
                  ref={inputRef}
                  value={newColumnName}
                  onChange={(changeEvent) => setNewColumnName(changeEvent.target.value)}
                  onKeyDown={(keyboardEvent) => {
                    if (keyboardEvent.key === "Enter") handleCreateColumn();
                    if (keyboardEvent.key === "Escape") {
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
      <LoginPrompt isOpen={showLogin} onLoginClick={() => navigate("/login")} />
    </div>
  );
};

export default BoardView;
