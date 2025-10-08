import { nanoid } from "nanoid";
import type { BoardForm, BoardItem } from "../../utils/types/dashboard";
import type { AppDispatch } from "../store/store";
import { loadFromStorage, saveToStorage } from "../../utils/storage";
import { BOARDS_STORAGE_KEY } from "../../utils/constants/board";
import { boardAdded, boardDeleted, boardsLoaded, boardUpdated } from "../slices/board.slice";
import { toast } from "react-toastify";

export function readAllBoards(): BoardItem[] {
  const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
  return (Array.isArray(stored) ? stored : []) as BoardItem[];
}

export function writeAllBoards(allBoards: BoardItem[]): void {
  saveToStorage(BOARDS_STORAGE_KEY, allBoards);
}

export function normalizeBoardName(name: string): string {
  return name.trim().split(" ").filter(Boolean).join(" ").toLowerCase();
}


export const loadBoardsForUser =
  (userId: string) => (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();
    const userBoards = allBoards.filter((b) => b.userId === userId);
    dispatch(boardsLoaded(userBoards));
  };

export const createBoardForUser =
  (userId: string, form: BoardForm) => (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();

    const normalizedName = normalizeBoardName(form.name);
    if (!normalizedName) {
      toast.error("Please enter a board name.");
      return;
    }

    const isDuplicate = allBoards
      .filter((board) => board.userId === userId)
      .some((board) => normalizeBoardName(board.name) === normalizedName);

    if (isDuplicate) {
      toast.error("A board with this name already exists.");
      return;
    }

    const createdBoard: BoardItem = {
      id: nanoid(),
      userId,
      name: form.name.trim(),
      type: form.type.trim(),
      color: form.color,
    };

    writeAllBoards([createdBoard, ...allBoards]);
    dispatch(boardAdded(createdBoard));
  };

export const updateBoardForUser =
  (userId: string, boardId: string, form: BoardForm) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();

    const normalizedName = normalizeBoardName(form.name);
    if (!normalizedName) {
      toast.error("Please enter a board name.");
      return;
    }

    const isDuplicate = allBoards
      .filter((board) => board.userId === userId)
      .some(
        (board) => board.id !== boardId && normalizeBoardName(board.name) === normalizedName
      );

    if (isDuplicate) {
      toast.error("A board with this name already exists.");
      return;
    }

    const updatedAllBoards = allBoards.map((board) =>
      board.id === boardId && board.userId === userId ? { ...board, ...form } : board
    );
    writeAllBoards(updatedAllBoards);

    dispatch(boardUpdated({ id: boardId, data: form }));
  };

export const deleteBoardForUser =
  (userId: string, boardId: string) => (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();
    const remaining = allBoards.filter(
      (board) => !(board.id === boardId && board.userId === userId)
    );
    writeAllBoards(remaining);

    dispatch(boardDeleted(boardId));
  };
