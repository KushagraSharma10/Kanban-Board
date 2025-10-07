import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { loadFromStorage, saveToStorage } from "../../utils/storage";
import { BOARDS_STORAGE_KEY } from "../../utils/constants/board";
import type { BoardForm, BoardItem } from "../../utils/types/dashboard";
import type { AppDispatch, RootState } from "../../store/store";

function readAllBoards(): BoardItem[] {
  const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
  return (Array.isArray(stored) ? stored : []) as BoardItem[];
}

function writeAllBoards(allBoards: BoardItem[]): void {
  saveToStorage(BOARDS_STORAGE_KEY, allBoards);
}

function normalizeBoardName(name: string): string {
  return name.trim().split(" ").filter(Boolean).join(" ").toLowerCase();
}

type BoardsState = {
  items: BoardItem[];
};

const initialState: BoardsState = {
  items: [],
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    boardsLoaded(currentState, action: PayloadAction<BoardItem[]>) {
      currentState.items = action.payload;
    },
    boardAdded(currentState, action: PayloadAction<BoardItem>) {
      currentState.items = [action.payload, ...currentState.items];
    },
    boardUpdated(
      currentState,
      action: PayloadAction<{ id: string; data: BoardForm }>
    ) {
      const { id, data } = action.payload;
      currentState.items = currentState.items.map((board) =>
        board.id === id ? { ...board, ...data } : board
      );
    },
    boardDeleted(currentState, action: PayloadAction<string>) {
      const boardId = action.payload;
      currentState.items = currentState.items.filter(
        (board) => board.id !== boardId
      );
    },
  },
});

export const { boardsLoaded, boardAdded, boardUpdated, boardDeleted } =
  boardsSlice.actions;
export default boardsSlice.reducer;

export const selectBoards = (state: RootState) => state.boards.items;

export const loadBoardsForUser =
  (userId: string) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();
    const userBoards = allBoards.filter((board) => board.userId === userId);
    dispatch(boardsLoaded(userBoards));
  };

export const createBoardForUser =
  (userId: string, form: BoardForm) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();

    const normalizedName = normalizeBoardName(form.name);
    if (!normalizedName) {
      alert("Please enter a board name.");
      return;
    }

    const isDuplicate = allBoards
      .filter((board) => board.userId === userId)
      .some((board) => normalizeBoardName(board.name) === normalizedName);

    if (isDuplicate) {
      alert("A board with this name already exists.");
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
      alert("Please enter a board name.");
      return;
    }

    const isDuplicate = allBoards
      .filter((board) => board.userId === userId)
      .some(
        (board) =>
          board.id !== boardId &&
          normalizeBoardName(board.name) === normalizedName
      );

    if (isDuplicate) {
      alert("A board with this name already exists.");
      return;
    }

    const updatedAllBoards = allBoards.map((board) =>
      board.id === boardId && board.userId === userId
        ? { ...board, ...form }
        : board
    );
    writeAllBoards(updatedAllBoards);

    dispatch(boardUpdated({ id: boardId, data: form }));
  };

export const deleteBoardForUser =
  (userId: string, boardId: string) =>
  (dispatch: AppDispatch): void => {
    const allBoards = readAllBoards();
    const remaining = allBoards.filter(
      (board) => !(board.id === boardId && board.userId === userId)
    );
    writeAllBoards(remaining);

    dispatch(boardDeleted(boardId));
  };
