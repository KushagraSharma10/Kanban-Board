import { apiClient } from "../../lib/apiClient";

export type BackendTask = {
  _id: string;
  boardId: string;
  columnId: string;
  title: string;
  description?: string | null;
  priority?: "none" | "low" | "medium" | "high" | "urgent" | null;
  dueDate?: string | null;
  assigneeId?: string | null;
  assigneeEmail?: string | null;
  position: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};

type ListEnvelope = { success?: boolean; data: BackendTask[] } | BackendTask[];
type OneEnvelope = { success?: boolean; data: BackendTask } | BackendTask;

const unwrapList = (payload: ListEnvelope): BackendTask[] =>
  Array.isArray(payload) ? payload : payload.data;

const unwrapOne = (payload: OneEnvelope): BackendTask =>
  (payload as { data?: BackendTask }).data ?? (payload as BackendTask);

export const fetchTasks = async (
  boardId: string,
  columnId: string
): Promise<BackendTask[]> => {
  const res = await apiClient.get<ListEnvelope>(
    `/${boardId}/columns/${columnId}/tasks`
  );
  return unwrapList(res.data);
};

export const createTask = async (
  boardId: string,
  columnId: string,
  body: {
    title: string;
    description?: string | null;
     priority?: "none" | "low" | "medium" | "high" | "urgent" | null; 
    dueDate?: string | null;
    assigneeEmail?: string | null;
  }
): Promise<BackendTask> => {
  const res = await apiClient.post<OneEnvelope>(
    `/${boardId}/columns/${columnId}/tasks`,
    body
  );
  return unwrapOne(res.data);
};

export const updateTask = async (
  boardId: string,
  columnId: string,
  taskId: string,
  body: Partial<{
    title: string;
    description: string | null;
     priority: "none" | "low" | "medium" | "high" | "urgent" | null; 
    dueDate: string | null;
    assigneeEmail: string | null;
  }>
): Promise<BackendTask> => {
  const res = await apiClient.patch<OneEnvelope>(
    `/${boardId}/columns/${columnId}/tasks/${taskId}`,
    body
  );
  return unwrapOne(res.data);
};

export const deleteTask = async (
  boardId: string,
  columnId: string,
  taskId: string
): Promise<boolean> => {
  const res = await apiClient.delete(
    `/${boardId}/columns/${columnId}/tasks/${taskId}`
  );
  return res.status === 200 || res.status === 204;
};

export const fetchTask = async (
  boardId: string,
  columnId: string,
  taskId: string
): Promise<BackendTask> => {
  const res = await apiClient.get<OneEnvelope>(
    `/${boardId}/columns/${columnId}/tasks/${taskId}`
  );
  return unwrapOne(res.data);
};
