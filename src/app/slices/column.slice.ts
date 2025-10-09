import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ColumnItem } from "../../utils/types/board-view";
import type { ColumnsState, StoredColumn } from "../../utils/types/column";
import type { RootState } from "../store/store";

const initialState: ColumnsState = { items: [] };

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    setColumnsForBoard(
      state,
      action: PayloadAction<{ boardId: string; columns: StoredColumn[] }>
    ) {
      const { boardId, columns } = action.payload;
      const otherBoardsColumns = state.items.filter(
        (column) => column.boardId !== boardId
      );
      state.items = [...otherBoardsColumns, ...columns];
    },
  },
});

export const { setColumnsForBoard } = columnsSlice.actions;
export default columnsSlice.reducer;

export const selectColumnItemsForBoard = (
  state: RootState,
  boardId: string
): ColumnItem[] =>
  state.columns.items
    .filter((column) => column.boardId === boardId)
    .map((column) => ({ id: column.id, title: column.title }));
