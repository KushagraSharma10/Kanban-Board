import { nanoid } from "nanoid";
import type { BoardForm, BoardItem } from "../../utils/types/dashboard";
import type { AppDispatch } from "../store/store";
import { loadFromStorage, saveToStorage } from "../../utils/storage";
import { BOARDS_STORAGE_KEY } from "../../utils/constants/board";
import {
  boardAdded,
  boardDeleted,
  boardsLoaded,
  boardUpdated,
} from "../slices/board.slice";
import { toast } from "react-toastify";
import { validateBoardForm } from "../../utils/board";

export const readAllBoards = (): BoardItem[] => {
  const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
  return (Array.isArray(stored) ? stored : []) as BoardItem[];
}

export const writeAllBoards = (allBoards: BoardItem[]): void => {
  saveToStorage(BOARDS_STORAGE_KEY, allBoards);
}

export const loadBoardsForUser =
  (userId: string) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();
    const userBoards = allBoards.filter((b) => b.userId === userId);
    dispatch(boardsLoaded(userBoards));
  };

export const createBoardForUser =
  (userId: string, form: BoardForm) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();

    const validationError = validateBoardForm(allBoards, userId, null, form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const newBoard: BoardItem = {
      id: nanoid(),
      userId,
      name: form.name.trim(),
      type: form.type.trim(),
      color: form.color,
    };

    writeAllBoards([newBoard, ...allBoards]);
    dispatch(boardAdded(newBoard));
  };

export const updateBoardForUser =
  (userId: string, boardId: string, form: BoardForm) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();

    const validationError = validateBoardForm(allBoards, userId, boardId, form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const updatedBoards = allBoards.map((board) =>
      board.id === boardId && board.userId === userId
        ? { ...board, ...form }
        : board
    );

    writeAllBoards(updatedBoards);
    dispatch(boardUpdated({ id: boardId, data: form }));
  };

export const deleteBoardForUser =
  (userId: string, boardId: string) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();
    const remainingBoards = allBoards.filter(
      (board) => !(board.id === boardId && board.userId === userId)
    );
    writeAllBoards(remainingBoards);
    dispatch(boardDeleted(boardId));
  };
