import type { StoredColumn } from "./columns";

export function saveBoardColumnOrder(
  boardId: string,
  nextColumnsLight: Array<{ id: string; title: string }>,
  loadColumnsForBoard: (boardId: string) => StoredColumn[],
  saveColumnsForBoard: (boardId: string, columns: StoredColumn[]) => void
) {
  const storedFullColumns = loadColumnsForBoard(boardId);
  const reorderedFullColumns: StoredColumn[] = nextColumnsLight
    .map((light) => storedFullColumns.find((full) => full.id === light.id))
    .filter(Boolean) as StoredColumn[];
  saveColumnsForBoard(boardId, reorderedFullColumns);
}
