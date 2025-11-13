import type { CardData } from "../interface/card";

export type CardsState = { items: CardData[] };

export type BackendTask = {
  _id: string;
  boardId: string;
  columnId: string;
  title: string;
  description?: string | null;
  priority?: "none" | "low" | "moderate" | "high" | "urgent" | null;
  dueDate?: string | null;
  assigneeId?: string | null;
  assigneeEmail?: string | null;
  position: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};
