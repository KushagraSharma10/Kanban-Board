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

const BoardView: React.FC = () => {
  const [boardName, setBoardName] = useState<string>("");
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
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
    if (boardId) {
      dispatch(SeedColumnsForBoard(boardId));
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
  };

  return (
    <div className="w-full min-h-screen text-[#e6edf3] bg-[#0b0f14]">
      <header className="p-4 md:p-6 border-b border-[#3a3f44] bg-[#161a21] flex items-center gap-3 md:gap-4 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <img src="../public/Kanban.svg" alt="photo" className="w-9 h-9" />
          <h1 className="text-base md:text-xl font-semibold text-[#e6edf3]">
            {boardName || "Board"}
          </h1>
        </div>
        <input
          value={cardSearch}
          onChange={(e) => setCardSearch(e.target.value)}
          placeholder="Search cards (title, label, assignee)…"
          className="flex-1 max-w-[420px] px-3 py-2 rounded-md bg-[#0b0f14] border border-[#3a3f44] outline-none placeholder-[#9e9e9e] focus:ring-2 focus:ring-[#0096ff]/30 focus:border-[#6ca0ff]"
        />
        <button
          onClick={() => setShowAdd((previous) => !previous)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#222c38] hover:brightness-110 border border-[#3a3f44] text-[#e6edf3]"
        >
          <GoPlus className="text-lg" />
          Add Column
        </button>
      </header>

      <div className="w-full min-h-[90vh] overflow-auto">
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
              className="min-w-[70vw] md:min-w-[40vw] h-fit lg:min-w-[22vw] rounded-lg border border-[#3a3f44] bg-[#161a21] transition-colors hover:border-[#a3b1c2]/40"
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
          <div className="min-w-[22vw] max-w-[22vw]">
            {showAdd ? (
              <div className="rounded-lg bg-[#161a21] border border-[#3a3f44] p-3 md:p-4 shadow-[0_0_0_1px_rgba(58,63,68,0.2)]">
                <input
                  ref={inputRef}
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={handleColumnInputKeyDown}
                  maxLength={15}
                  className="w-full rounded-md text-sm border border-[#3a3f44] bg-[#222c38] px-3 py-2 outline-none placeholder-[#9e9e9e] focus:border-[#6ca0ff] focus:ring-2 focus:ring-[#0096ff]/30"
                  placeholder="Column name"
                />
                <div className="mt-3 flex items-center">
                  <button
                    onClick={handleCreateColumn}
                    disabled={!newColumnName.trim()}
                    className="px-3 py-1.5 rounded-md bg-[#0096ff] text-sm text-black hover:bg-[#6ca0ff] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancelAddColumn}
                    className="ml-auto px-3 py-2 rounded-md border border-transparent text-[#e6edf3] hover:bg-[#2a3b4f]/30"
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
                className="w-fit px-4 md:w-full py-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#3a3f44] bg-[#161a21]/60 hover:bg-[#161a21] text-sm text-[#e6edf3]"
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
