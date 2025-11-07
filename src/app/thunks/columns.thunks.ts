import { toast } from "react-toastify";
import type { AppDispatch } from "../store/store";
import { setColumnsForBoard } from "../slices/column.slice";
import type { ColumnItem } from "../../utils/types/board-view";
import type { StoredColumn } from "../../utils/types/column";
import {
  fetchColumns,
  createColumn as createColumnApi,
  renameColumn as renameColumnApi,
  deleteColumn as deleteColumnApi,
  reorderColumns as reorderColumnsApi,
  type BackendColumn,
} from "../api/column.api";

const toStoredColumn = (server: BackendColumn): StoredColumn => ({
  id: server._id,
  boardId: server.boardId,
  title: server.name,
  createdAt: server.createdAt ? Date.parse(server.createdAt) : Date.now(),
});

const toStoredColumns = (serverList: BackendColumn[]): StoredColumn[] =>
  serverList
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(toStoredColumn);

const getErrorMessage = (value: unknown): string => {
  const maybeAxios = value as { response?: { data?: { message?: string } } };
  if (maybeAxios?.response?.data?.message) return maybeAxios.response.data.message;
  if (value instanceof Error) return value.message;
  return "Request failed";
};

export const loadColumnsForBoardFromServer =
  (boardId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const serverColumns = await fetchColumns(boardId);
      dispatch(setColumnsForBoard({ boardId, columns: toStoredColumns(serverColumns) }));
    } catch (error) {
      toast.error(getErrorMessage(error));
      dispatch(setColumnsForBoard({ boardId, columns: [] }));
    }
  };

export const createColumnOnServer =
  (boardId: string, title: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      await createColumnApi(boardId, title.trim());
      const serverColumns = await fetchColumns(boardId);
      dispatch(setColumnsForBoard({ boardId, columns: toStoredColumns(serverColumns) }));
      toast.success("Column created");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const renameColumnOnServer =
  (boardId: string, columnId: string, newTitle: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      await renameColumnApi(boardId, columnId, newTitle.trim());
      const serverColumns = await fetchColumns(boardId);
      dispatch(setColumnsForBoard({ boardId, columns: toStoredColumns(serverColumns) }));
      toast.success("Column renamed");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const deleteColumnOnServer =
  (boardId: string, columnId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const isDeleted = await deleteColumnApi(boardId, columnId);
      if (!isDeleted) {
        toast.error("Failed to delete column");
        return;
      }
      const serverColumns = await fetchColumns(boardId);
      dispatch(setColumnsForBoard({ boardId, columns: toStoredColumns(serverColumns) }));
      toast.success("Column deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const applyColumnOrderOnServer =
  (boardId: string, nextColumns: ColumnItem[]) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const updates = nextColumns.map((column, index) => ({
        columnId: column.id,
        position: index,
      }));
      const reordered = await reorderColumnsApi(boardId, updates);
      dispatch(setColumnsForBoard({ boardId, columns: toStoredColumns(reordered) }));
      toast.success("Columns reordered");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
