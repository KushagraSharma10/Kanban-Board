import { toast } from "react-toastify";
import {
  boardsLoaded,
  boardAdded,
  boardUpdated,
  boardDeleted,
} from "../slices/board.slice";
import type { AppDispatch } from "../store/store";
import type { BoardForm, BoardItem } from "../../utils/types/dashboard";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../api/board.api";
import type { BackendBoard } from "../../utils/types/board";
import { getErrorMessage } from "../../utils/api-error";

const toBoardItem = (backend: BackendBoard): BoardItem => ({
  id: backend._id,
  userId: backend.createdBy,
  name: backend.name,
  type: backend.type,
  color: backend.color,
});


export const loadBoardsForUser =
  (_userId: string | null) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const backendBoards = await fetchBoards();
      dispatch(boardsLoaded(backendBoards.map(toBoardItem)));
    } catch (error) {
      toast.error(getErrorMessage(error));
      dispatch(boardsLoaded([]));
    }
  };

export const createBoardForUser =
  (_userId: string | null, form: BoardForm) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const created = await createBoard({
        name: form.name.trim(),
        type: form.type.trim(),
        color: form.color,
      });
      dispatch(boardAdded(toBoardItem(created)));
      toast.success("Board created");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const updateBoardForUser =
  (_userId: string | null, boardId: string, form: BoardForm) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const updated = await updateBoard(boardId, {
        name: form.name.trim(),
        type: form.type.trim(),
        color: form.color,
      });
      dispatch(boardUpdated({ id: boardId, data: toBoardItem(updated) }));
      toast.success("Board updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const deleteBoardForUser =
  (_userId: string | null, boardId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const isBoardDeleted = await deleteBoard(boardId);

      if (isBoardDeleted) {
        dispatch(boardDeleted(boardId));
        toast.success("Board deleted successfully");
      } else {
        toast.error("Failed to delete the board. Please try again.");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };
