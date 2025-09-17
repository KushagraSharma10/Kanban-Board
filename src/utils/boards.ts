import { loadFromStorage, saveToStorage } from "./storage";
import type { BoardItem } from "../types/auth.ts";

const BOARDS_STORAGE_KEY = "kanban.boards";

export function getAllBoards(): BoardItem[] {
  return loadFromStorage(BOARDS_STORAGE_KEY, []) as BoardItem[];
}

export function saveAllBoards(boards: BoardItem[]) {
  saveToStorage(BOARDS_STORAGE_KEY, boards);
}
