import type { ColumnItem } from "./board-view";

export type ColumnProps = {
  column: ColumnItem;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  boardId: string;
  searchText?: string;
};

export type StoredColumn = {
  id: string;
  boardId: string;
  title: string;
  createdAt: number;
};

export type ColumnsState = { items: StoredColumn[] };


export type BackendColumn = {
  _id: string;
  boardId: string;
  name: string;
  position: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};
