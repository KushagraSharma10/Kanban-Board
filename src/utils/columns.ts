import { nanoid } from "nanoid";

export type StoredColumn = {
  id: string;
  boardId: string;
  title: string;
  createdAt: number;
};

const COLUMNS_KEY = "kanban.columns";

export function loadAllColumns(): StoredColumn[] {
  try {
    const raw = localStorage.getItem(COLUMNS_KEY);
    return raw ? (JSON.parse(raw) as StoredColumn[]) : [];
  } catch {
    return [];
  }
}

export function saveAllColumns(columns: StoredColumn[]): void {
  localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
}

export function loadColumnsForBoard(boardId: string): StoredColumn[] {
  return loadAllColumns().filter((column) => column.boardId === boardId);
}

export function saveColumnsForBoard(boardId: string, nextColumns: StoredColumn[]): void {
  const all = loadAllColumns().filter((column) => column.boardId !== boardId);
  saveAllColumns([...all, ...nextColumns]);
}

export function ensureDefaultColumns(boardId: string): StoredColumn[] {
  const existing = loadColumnsForBoard(boardId);
  if (existing.length > 0) return existing;

  const now = Date.now();
  const defaults: StoredColumn[] = [
    { id: nanoid(), boardId, title: "To Do",       createdAt: now },
    { id: nanoid(), boardId, title: "In Progress", createdAt: now },
    { id: nanoid(), boardId, title: "Done",        createdAt: now },
  ];

  const all = loadAllColumns();
  saveAllColumns([...all, ...defaults]);
  return defaults;
}

export function addColumn(boardId: string, titleRaw: string): StoredColumn[] {
  const title = titleRaw.trim();
  if (!title) return loadColumnsForBoard(boardId);

  const current = loadColumnsForBoard(boardId);
  const duplicate = current.some((column) => column.title.toLowerCase() === title.toLowerCase());
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

export function renameColumn(boardId: string, columnId: string, newTitleRaw: string): StoredColumn[] {
  const newTitle = newTitleRaw.trim();
  if (!newTitle) return loadColumnsForBoard(boardId);

  const current = loadColumnsForBoard(boardId);
  const duplicate = current.some(
    (column) => column.id !== columnId && column.title.toLowerCase() === newTitle.toLowerCase()
  );
  if (duplicate) return current;

  const updated = current.map((column) =>
    column.id === columnId ? { ...column, title: newTitle } : column
  );
  saveColumnsForBoard(boardId, updated);
  return updated;
}

export function deleteColumn(boardId: string, columnId: string): StoredColumn[] {
  const updated = loadColumnsForBoard(boardId).filter((column) => column.id !== columnId);
  saveColumnsForBoard(boardId, updated);
  return updated;
}
