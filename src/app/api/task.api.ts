import { apiClient } from "../../lib/apiClient";
import { unwrapList, unwrapOne, type ApiListEnvelope, type ApiOneEnvelope, } from "../../utils/types/api";
import type { BackendTask } from "../../utils/types/card";

export const fetchTasks = async (
  boardId: string,
  columnId: string
): Promise<BackendTask[]> => {
  const res = await apiClient.get<ApiListEnvelope<BackendTask>>(
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
     priority?: "none" | "low" | "moderate" | "high" | "urgent" | null; 
    dueDate?: string | null;
    assigneeEmail?: string | null;
  }
): Promise<BackendTask> => {
  const res = await apiClient.post<ApiOneEnvelope<BackendTask>>(
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
     priority: "none" | "low" | "moderate" | "high" | "urgent" | null; 
    dueDate: string | null;
    assigneeEmail: string | null;
  }>
): Promise<BackendTask> => {
  const res = await apiClient.patch<ApiOneEnvelope<BackendTask>>(
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
  const res = await apiClient.get<ApiOneEnvelope<BackendTask>>(
    `/${boardId}/columns/${columnId}/tasks/${taskId}`
  );
  return unwrapOne(res.data);
};
