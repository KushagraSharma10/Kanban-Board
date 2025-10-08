import { nanoid } from "nanoid";
import type { AppDispatch } from "../store/store";
import type { StoredColumn } from "../../utils/types/column";
import { saveBoardColumnOrder } from "../../utils/order-storage";
import { COLUMNS_KEY } from "../../utils/constants/column";
import { setColumnsForBoard } from "../slices/column.slice";

const loadAllColumns = (): StoredColumn[] => {
  try {
    const raw = localStorage.getItem(COLUMNS_KEY);
    return raw ? (JSON.parse(raw) as StoredColumn[]) : [];
  } catch {
    return [];
  }
};

const saveAllColumns = (columns: StoredColumn[]): void => {
  localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
};

const loadColumnsForBoard = (boardId: string): StoredColumn[] =>
  loadAllColumns().filter((c) => c.boardId === boardId);

const saveColumnsForBoard = (boardId: string, updated: StoredColumn[]): void => {
  const remaining = loadAllColumns().filter((c) => c.boardId !== boardId);
  saveAllColumns([...remaining, ...updated]);
};

const ensureDefaultColumns = (boardId: string): StoredColumn[] => {
  const existing = loadColumnsForBoard(boardId);
  if (existing.length > 0) return existing;

  const timestamp = Date.now();
  const defaults: StoredColumn[] = [
    { id: nanoid(), boardId, title: "To Do", createdAt: timestamp },
    { id: nanoid(), boardId, title: "In Progress", createdAt: timestamp },
    { id: nanoid(), boardId, title: "Done", createdAt: timestamp },
  ];

  const all = loadAllColumns();
  saveAllColumns([...all, ...defaults]);
  return defaults;
};

const addColumn = (boardId: string, titleRaw: string): StoredColumn[] => {
  const title = titleRaw.trim();
  if (!title) return loadColumnsForBoard(boardId);

  const currentColumns = loadColumnsForBoard(boardId);
  const duplicate = currentColumns.some((column) => column.title.toLowerCase() === title.toLowerCase());
  if (duplicate) return currentColumns;

  const newColumn: StoredColumn = { id: nanoid(), boardId, title, createdAt: Date.now() };
  const updatedColumns = [...currentColumns, newColumn];
  saveColumnsForBoard(boardId, updatedColumns);
  return updatedColumns;
};

const renameColumn = (
  boardId: string,
  columnId: string,
  newTitleRaw: string
): StoredColumn[] => {
  const newTitle = newTitleRaw.trim();
  if (!newTitle) return loadColumnsForBoard(boardId);

  const current = loadColumnsForBoard(boardId);
  const duplicate = current.some(
    (column) => column.id !== columnId && column.title.toLowerCase() === newTitle.toLowerCase()
  );
  if (duplicate) return current;

  const updated = current.map((column) => (column.id === columnId ? { ...column, title: newTitle } : column));
  saveColumnsForBoard(boardId, updated);
  return updated;
};

const deleteColumn = (boardId: string, columnId: string): StoredColumn[] => {
  const updatedColumn = loadColumnsForBoard(boardId).filter((c) => c.id !== columnId);
  saveColumnsForBoard(boardId, updatedColumn);
  return updatedColumn;
};

export const SeedColumnsForBoard =
  (boardId: string) =>
  (dispatch: AppDispatch): void => {
    const seeded = ensureDefaultColumns(boardId);
    dispatch(setColumnsForBoard({ boardId, columns: seeded }));
  };

export const createColumn =
  (boardId: string, title: string) =>
  (dispatch: AppDispatch): void => {
    const updatedColumn = addColumn(boardId, title);
    dispatch(setColumnsForBoard({ boardId, columns: updatedColumn }));
  };

export const renameColumnThunk =
  (boardId: string, columnId: string, newTitle: string) =>
  (dispatch: AppDispatch): void => {
    const updated = renameColumn(boardId, columnId, newTitle);
    dispatch(setColumnsForBoard({ boardId, columns: updated }));
  };

export const deleteColumnThunk =
  (boardId: string, columnId: string) =>
  (dispatch: AppDispatch): void => {
    const updated = deleteColumn(boardId, columnId);
    dispatch(setColumnsForBoard({ boardId, columns: updated }));
  };

export const applyColumnOrder =
  (boardId: string, nextColumns: Array<{ id: string; title: string }>) =>
  (dispatch: AppDispatch): void => {
    saveBoardColumnOrder(boardId, nextColumns, loadColumnsForBoard, saveColumnsForBoard);
    const reloaded = loadColumnsForBoard(boardId);
    dispatch(setColumnsForBoard({ boardId, columns: reloaded }));
  };
