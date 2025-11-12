import { apiClient } from "../../lib/apiClient";
import { unwrapList, unwrapOne, type ApiListEnvelope, type ApiOneEnvelope } from "../../utils/types/api";
import type { BackendColumn } from "../../utils/types/column";

export const fetchColumns = async (boardId: string): Promise<BackendColumn[]> => {
  const response = await apiClient.get<ApiListEnvelope<BackendColumn>>(`/${boardId}/columns`);
  return unwrapList(response.data);
};

export const createColumn = async (boardId: string, name: string): Promise<BackendColumn> => {
  const response = await apiClient.post<ApiOneEnvelope<BackendColumn>>(`/${boardId}/columns`, { name });
  return unwrapOne(response.data);
};

export const renameColumn = async (boardId: string, columnId: string, name: string): Promise<BackendColumn> => {
  const response = await apiClient.patch<ApiOneEnvelope<BackendColumn>>(`/${boardId}/columns/${columnId}`, { name });
  return unwrapOne(response.data);
};

export const deleteColumn = async (boardId: string, columnId: string): Promise<boolean> => {
  const response = await apiClient.delete(`/${boardId}/columns/${columnId}`);
  return response.status === 200 || response.status === 204;
};

export const reorderColumns = async (
  boardId: string,
  updates: Array<{ columnId: string; position: number }>
): Promise<BackendColumn[]> => {
  const response = await apiClient.patch<ApiListEnvelope<BackendColumn>>(`/${boardId}/columns/reorder`, { updates });
  return unwrapList(response.data);
};
