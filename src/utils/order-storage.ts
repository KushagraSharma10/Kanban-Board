import type { StoredColumn } from "./columns";

export function saveBoardColumnOrder(
  boardId: string,
  nextColumns: Array<{ id: string; title: string }>,
  loadColumnsForBoard: (boardId: string) => StoredColumn[],
  saveColumnsForBoard: (boardId: string, columns: StoredColumn[]) => void
) {
  const storedFullColumns = loadColumnsForBoard(boardId);
  const reorderedFullColumns: StoredColumn[] = nextColumns
    .map((column) => storedFullColumns.find((full) => full.id === column.id))
    .filter(Boolean) as StoredColumn[];
  saveColumnsForBoard(boardId, reorderedFullColumns);
}
