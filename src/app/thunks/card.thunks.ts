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

const isoToYMD = (iso?: string | null): string | undefined => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const ymdToIso = (ymd?: string): string | null => {
  if (!ymd) return null;
  const t = new Date(ymd);
  if (isNaN(t.getTime())) return null;
  return t.toISOString();
};

const toCardData = (server: BackendTask): CardData => ({
  id: server._id,
  title: server.title,
  description: server.description ?? undefined,
  dueDate: isoToYMD(server.dueDate),
  boardId: server.boardId,
  columnId: server.columnId,
  assigneeEmail: server.assigneeEmail ?? undefined,
  label: server.priority ?? undefined,
  createdBy: server.createdBy,
});

const toCardList = (list: BackendTask[]): CardData[] =>
  list
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(toCardData);

const getErrorMessage = (err: unknown): string => {
  const maybeAxios = err as { response?: { data?: { message?: string } } };
  return (
    maybeAxios?.response?.data?.message ??
    (err instanceof Error ? err.message : "Request failed")
  );
};

export const loadCardsForColumnFromServer =
  (boardId: string, columnId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const serverTasks = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: toCardList(serverTasks) }));
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
      dispatch(setCardsForColumn({ columnId, cards: toCardList(serverTasks) }));
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
            ? ymdToIso(incoming.dueDate)
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
      dispatch(setCardsForColumn({ columnId, cards: toCardList(serverTasks) }));
      toast.success("Card updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const deleteCardFromColumnOnServer =
  (boardId: string, columnId: string, taskId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const ok = await deleteTaskApi(boardId, columnId, taskId);
      if (!ok) {
        toast.error("Failed to delete card");
        return;
      }
      const serverTasks = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: toCardList(serverTasks) }));
      toast.success("Card deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

export const cloneCardInColumnOnServer =
  (boardId: string, columnId: string, sourceCardId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const current = await fetchTasks(boardId, columnId);

      const source = current.find((t) => t._id === sourceCardId);
      if (!source) {
        toast.error("Source card not found.");
        return;
      }

      const existingTitles = current.map((t) => t.title);
      const clonedTitle = getNextCloneTitle(source.title, existingTitles);

      await createTaskApi(boardId, columnId, {
        title: clonedTitle,
        description: source.description ?? null,        
        dueDate: source.dueDate ?? null,             
        assigneeEmail: source.assigneeEmail ?? null, 
        ...(typeof source.priority === "string"         
          ? { priority: source.priority }             
          : {}),
      });

      const refreshed = await fetchTasks(boardId, columnId);
      dispatch(setCardsForColumn({ columnId, cards: toCardList(refreshed) }));
      toast.success("Card cloned");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
