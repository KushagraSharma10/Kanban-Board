import type { BoardItem } from "./dashboard";

export type BoardsState = {
  items: BoardItem[];
};

export type BackendBoard = {
  _id: string;
  name: string;
  type: string;
  color: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBoardPayload = {
  name: string;
  type: string;
  color: string;
};

export type UpdateBoardPayload = Partial<CreateBoardPayload>;