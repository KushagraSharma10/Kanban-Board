import { toast } from "react-toastify";
import type { AppDispatch } from "../store/store";
import { setCardsForColumn } from "../slices/card.slice";
import type { CardData } from "../../utils/interface/card";
import {
  fetchTasks,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  type BackendTask,
} from "../api/task.api";
import { getNextCloneTitle } from "../../utils/get-clone-Title";
import { formatDateStringToIso, formatIsoToDateString } from "../../utils/task";
import { getErrorMessage } from "../../utils/api-error";


const formatTask = (server: BackendTask): CardData => ({
  id: server._id,
  title: server.title,
  description: server.description ?? undefined,
  dueDate: formatIsoToDateString(server.dueDate),
  boardId: server.boardId,
  columnId: server.columnId,
  assigneeEmail: server.assigneeEmail ?? undefined,
  label: server.priority ?? undefined,
  createdBy: server.createdBy,
});

const formatTasks = (list: BackendTask[]): CardData[] =>
  list
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(formatTask);



export const loadCardsForColumnFromServer =
  (boardId: string, columnId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const serverTasks = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: formatTasks(serverTasks) }));
    } catch (error) {
      toast.error(getErrorMessage(error));
      dispatch(setCardsForColumn({ columnId, cards: [] }));
    }
  };

export const addCardToColumnOnServer =
  (boardId: string, columnId: string, rawTitle: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const title = rawTitle.trim();
      if (!title) {
        toast.error("Title cannot be empty.");
        return;
      }

      await createTaskApi(boardId, columnId, {
        title,
        description: null,
        priority: undefined,
        dueDate: null,
        assigneeEmail: null,
      });

      const serverTasks = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: formatTasks(serverTasks) }));
      toast.success("Card created");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const updateCardInColumnOnServer =
  (boardId: string, columnId: string, incoming: CardData) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const normalizedTitle = incoming.title.trim();
      if (!normalizedTitle) {
        toast.error("Title cannot be empty.");
        return;
      }

      const payload: Record<string, unknown> = {
        title: normalizedTitle,
        description:
          typeof incoming.description !== "undefined"
            ? incoming.description ?? null
            : undefined,
        dueDate:
          typeof incoming.dueDate !== "undefined"
            ? formatDateStringToIso(incoming.dueDate)
            : undefined,
      };

      if (typeof incoming.label !== "undefined") {
        payload.priority = incoming.label;
      }

      payload.assigneeEmail =
        typeof incoming.assigneeEmail !== "undefined"
          ? incoming.assigneeEmail || null
          : undefined;

      await updateTaskApi(boardId, columnId, incoming.id, payload);

      const serverTasks = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: formatTasks(serverTasks) }));
      toast.success("Card updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const deleteCardFromColumnOnServer =
  (boardId: string, columnId: string, taskId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const isDeleted = await deleteTaskApi(boardId, columnId, taskId);
      if (!isDeleted) {
        toast.error("Failed to delete card");
        return;
      }
      const serverTasks = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: formatTasks(serverTasks) }));
      toast.success("Card deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const cloneCardInColumnOnServer =
  (boardId: string, columnId: string, sourceCardId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const currentTasks = await fetchTasks(boardId, columnId);

      const sourceTask = currentTasks.find((task) => task._id === sourceCardId);
      if (!sourceTask) {
        toast.error("Source card not found.");
        return;
      }

      const existingTitles = currentTasks.map((task) => task.title);
      const clonedTitle = getNextCloneTitle(sourceTask.title, existingTitles);

      await createTaskApi(boardId, columnId, {
        title: clonedTitle,
        description: sourceTask.description ?? null,        
        dueDate: sourceTask.dueDate ?? null,             
        assigneeEmail: sourceTask.assigneeEmail ?? null, 
        ...(typeof sourceTask.priority === "string"         
          ? { priority: sourceTask.priority }             
          : {}),
      });

      const refreshedTasks = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: formatTasks(refreshedTasks) }));
      toast.success("Card cloned");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
