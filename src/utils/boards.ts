import { toast } from "react-toastify";
import type { BoardForm, BoardItem } from "./types/dashboard";
import { loadFromStorage, saveToStorage } from "./storage";
import { BOARDS_STORAGE_KEY } from "./constants/board";

export const normalizeBoardName = (name: string) =>
  name.trim().split(" ").filter(Boolean).join(" ").toLowerCase();

export const getBoardsForUser = (userId: string): BoardItem[] => {
  return getAllBoards().filter((board) => board.userId === userId);
};

export const getAllBoards = (): BoardItem[] => {
  const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
  return (Array.isArray(stored) ? stored : []) as BoardItem[];
};

export const saveAllBoards = (all: BoardItem[]) => {
  saveToStorage(BOARDS_STORAGE_KEY, all);
};

export function validateBoardName(
  activeUserId: string,
  boardData: BoardForm,
  existingBoardId?: string
): string | null {
  const trimmedName = boardData.name.trim().split(/\s+/).join(" ");
  const normalizedNew = normalizeBoardName(trimmedName);

 if (!trimmedName) {
    toast.error("Please enter a board name.");
    return null;
  }

  const isDuplicate = getBoardsForUser(activeUserId).some(
    (board) =>
      board.id !== existingBoardId && normalizeBoardName(board.name) === normalizedNew
  );

  if (isDuplicate) {
    toast.error("A board with this name already exists.");
    return null;
  }

  return trimmedName;
}
