import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  ensureDefaultColumns,
  addColumn,
  renameColumn,
  deleteColumn,
  loadColumnsForBoard,
  saveColumnsForBoard,
  type StoredColumn,
} from "../../utils/columns";
import { saveBoardColumnOrder } from "../../utils/order-storage";
import type { ColumnItem } from "../../utils/types/board-view";
import type { AppDispatch, RootState } from "../../store/store";

type ColumnsState = {
  items: StoredColumn[];
};

const initialState: ColumnsState = {
  items: [],
};

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    setColumnsForBoard(
      currentState,
      action: PayloadAction<{ boardId: string; columns: StoredColumn[] }>
    ) {
      const { boardId, columns } = action.payload;
      const columnsFromOtherBoards = currentState.items.filter(
        (storedColumn) => storedColumn.boardId !== boardId
      );
      currentState.items = [...columnsFromOtherBoards, ...columns];
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
    .filter((storedColumn) => storedColumn.boardId === boardId)
    .map((storedColumn) => ({ id: storedColumn.id, title: storedColumn.title }));

export const loadOrSeedColumnsForBoard =
  (boardId: string) =>
  (dispatch: AppDispatch): void => {
    const seededColumns = ensureDefaultColumns(boardId);
    dispatch(setColumnsForBoard({ boardId, columns: seededColumns }));
  };

export const createColumn =
  (boardId: string, title: string) =>
  (dispatch: AppDispatch): void => {
    const updatedColumns = addColumn(boardId, title);
    dispatch(setColumnsForBoard({ boardId, columns: updatedColumns }));
  };

export const renameColumnThunk =
  (boardId: string, columnId: string, newTitle: string) =>
  (dispatch: AppDispatch): void => {
    const updatedColumns = renameColumn(boardId, columnId, newTitle);
    dispatch(setColumnsForBoard({ boardId, columns: updatedColumns }));
  };

export const deleteColumnThunk =
  (boardId: string, columnId: string) =>
  (dispatch: AppDispatch): void => {
    const updatedColumns = deleteColumn(boardId, columnId);
    dispatch(setColumnsForBoard({ boardId, columns: updatedColumns }));
  };

export const applyColumnOrder =
  (boardId: string, nextColumns: Array<{ id: string; title: string }>) =>
  (dispatch: AppDispatch): void => {
    saveBoardColumnOrder(
      boardId,
      nextColumns,
      loadColumnsForBoard,
      saveColumnsForBoard
    );
    const reloadedColumns = loadColumnsForBoard(boardId);
    dispatch(setColumnsForBoard({ boardId, columns: reloadedColumns }));
  };
