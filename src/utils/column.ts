import type { StoredColumn } from "../utils/types/column";
import { COLUMNS_KEY } from "./constants/column";
import { loadFromStorage, saveToStorage } from "./storage";

export function validateColumnTitle(
  boardId: string,
  titleRaw: string,
  existingColumnId?: string
): { isValid: boolean; columns: StoredColumn[]; title?: string } {
  const title = titleRaw.trim();
  const currentColumns = loadColumnsForBoard(boardId);

  if (!title) {
    return { isValid: false, columns: currentColumns };
  }

  const duplicate = currentColumns.some(
    (column) =>
      column.id !== existingColumnId &&
      column.title.toLowerCase() === title.toLowerCase()
  );

  if (duplicate) {
    return { isValid: false, columns: currentColumns };
  }

  return { isValid: true, columns: currentColumns, title };
}

export const loadAllColumns = (): StoredColumn[] => {
  return loadFromStorage(COLUMNS_KEY, [] as StoredColumn[]);
};

export const saveAllColumns = (columns: StoredColumn[]): void => {
  saveToStorage(COLUMNS_KEY, columns);
};

export const loadColumnsForBoard = (boardId: string): StoredColumn[] => {
  return loadAllColumns().filter((column) => column.boardId === boardId);
};
