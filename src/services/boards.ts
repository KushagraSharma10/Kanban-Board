import { nanoid } from "nanoid";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import type { BoardItem } from "../types/dashboard";

const BOARDS_STORAGE_KEY = "kanban.boards";

export function getAllBoards(): BoardItem[] {
  const storedBoards = loadFromStorage(BOARDS_STORAGE_KEY, []);
  return (Array.isArray(storedBoards) ? storedBoards : []) as BoardItem[];
}

export function saveAllBoards(allBoards: BoardItem[]): void {
  saveToStorage(BOARDS_STORAGE_KEY, allBoards);
}

export function getBoardsForUser(userId: string): BoardItem[] {
  return getAllBoards().filter((board) => board.userId === userId);
}

export function addBoardForUser(
  userId: string,
  boardData: { name: string; type: string; color: string }
): BoardItem {
  const allBoards = getAllBoards();
  const newBoard: BoardItem = {
    id: nanoid(),
    userId,
    name: boardData.name.trim(),
    type: boardData.type.trim(),
    color: boardData.color,
  };
  saveAllBoards([newBoard, ...allBoards]);
  return newBoard;
}

export function updateBoardForUser(
  userId: string,
  boardId: string,
  updateData: { name: string; type: string; color: string }
): void {
  const allBoards = getAllBoards();
  const updatedBoards = allBoards.map((board) =>
    board.id === boardId && board.userId === userId
      ? { ...board, ...updateData }
      : board
  );
  saveAllBoards(updatedBoards);
}

export function deleteBoardForUser(userId: string, boardId: string): void {
  const allBoards = getAllBoards();
  const remainingBoards = allBoards.filter(
    (board) => !(board.id === boardId && board.userId === userId)
  );
  saveAllBoards(remainingBoards);
}
