import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BoardForm, BoardItem } from "../../utils/types/dashboard";
import type { RootState } from "../store/store";

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
