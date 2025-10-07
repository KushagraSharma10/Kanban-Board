import type { ColumnItem } from "./board-view";

export type ColumnProps = {
  column: ColumnItem;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  boardId: string;
  searchText?: string;
};
