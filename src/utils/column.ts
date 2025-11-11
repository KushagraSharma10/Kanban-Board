import { loadColumnsForBoard } from "../app/thunks/columns.thunks";

export const validateColumnTitle = (
  boardId: string,
  titleRaw: string,
  excludeColumnId?: string
): { isValid: boolean; title: string; error?: string } => {
  const title = titleRaw.trim();
  if (!title) {
    return { isValid: false, title, error: "Title cannot be empty." };
  }

  const existingColumns = loadColumnsForBoard(boardId);
  const duplicate = existingColumns.some(
    (column) =>
      column.title.toLowerCase() === title.toLowerCase() &&
      column.id !== excludeColumnId
  );

  if (duplicate) {
    return { isValid: false, title, error: "Column title already exists." };
  }

  return { isValid: true, title };
};
