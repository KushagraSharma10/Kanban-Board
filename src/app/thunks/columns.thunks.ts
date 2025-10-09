import { nanoid } from "nanoid";
import type { AppDispatch } from "../store/store";
import type { StoredColumn } from "../../utils/types/column";
import { saveBoardColumnOrder } from "../../utils/order-storage";
import { COLUMNS_KEY } from "../../utils/constants/column";
import { setColumnsForBoard } from "../slices/column.slice";
import { validateColumnTitle } from "../../utils/column";
import { toast } from "react-toastify";

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

export const loadColumnsForBoard = (boardId: string): StoredColumn[] =>
  loadAllColumns().filter((column) => column.boardId === boardId);

const saveColumnsForBoard = (
  boardId: string,
  updatedColumn: StoredColumn[]
): void => {
  const remainingColumns = loadAllColumns().filter(
    (column) => column.boardId !== boardId
  );
  saveAllColumns([...remainingColumns, ...updatedColumn]);
};

const ensureDefaultColumns = (boardId: string): StoredColumn[] => {
  const existingColumns = loadColumnsForBoard(boardId);
  if (existingColumns.length > 0) return existingColumns;

  const timestamp = Date.now();
  const defaultsColumns: StoredColumn[] = [
    { id: nanoid(), boardId, title: "To Do", createdAt: timestamp },
    { id: nanoid(), boardId, title: "In Progress", createdAt: timestamp },
    { id: nanoid(), boardId, title: "Done", createdAt: timestamp },
  ];

  const allColumns = loadAllColumns();
  saveAllColumns([...allColumns, ...defaultsColumns]);
  return defaultsColumns;
};

const addColumn = (boardId: string, titleRaw: string): StoredColumn[] => {
  const validation = validateColumnTitle(boardId, titleRaw);
  if (!validation.isValid) {
    if (validation.error) {
      toast.error(validation.error);
    }
    return loadColumnsForBoard(boardId);
  }

  const currentColumns = loadColumnsForBoard(boardId);
  const newColumn: StoredColumn = {
    id: nanoid(),
    boardId,
    title: validation.title,
    createdAt: Date.now(),
  };

  const updatedColumns = [...currentColumns, newColumn];
  saveColumnsForBoard(boardId, updatedColumns);
  return updatedColumns;
};


const renameColumn = (
  boardId: string,
  columnId: string,
  newTitleRaw: string
): StoredColumn[] => {
  const validation = validateColumnTitle(boardId, newTitleRaw, columnId);
  if (!validation.isValid) {
    if (validation.error) {
      toast.error(validation.error);
    }
    return loadColumnsForBoard(boardId);
  }

  const currentColumns = loadColumnsForBoard(boardId);
  const updatedColumns = currentColumns.map((column) =>
    column.id === columnId ? { ...column, title: validation.title } : column
  );

  saveColumnsForBoard(boardId, updatedColumns);
  return updatedColumns;
};


const deleteColumn = (boardId: string, columnId: string): StoredColumn[] => {
  const updatedColumn = loadColumnsForBoard(boardId).filter(
    (column) => column.id !== columnId
  );
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
    const updatedColumns = deleteColumn(boardId, columnId);
    dispatch(setColumnsForBoard({ boardId, columns: updatedColumns }));
  };

export const applyColumnOrder =
  (boardId: string, nextColumns: Array<{ id: string; title: string }>) =>
  (dispatch: AppDispatch): void => {
    saveBoardColumnOrder(
      boardId,
      nextColumns,
      loadColumnsForBoard,
      saveColumnsForBoard
    );
    const reloadedColumns = loadColumnsForBoard(boardId);
    dispatch(setColumnsForBoard({ boardId, columns: reloadedColumns }));
  };
