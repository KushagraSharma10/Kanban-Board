import { apiClient } from "../../lib/apiClient";

export type BackendColumn = {
  _id: string;
  boardId: string;
  name: string;
  position: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};

type ListEnvelope = { success?: boolean; data: BackendColumn[] } | BackendColumn[];
type OneEnvelope  = { success?: boolean; data: BackendColumn } | BackendColumn;

const unwrapList = (payload: ListEnvelope): BackendColumn[] =>
  Array.isArray(payload) ? payload : payload.data;

const unwrapOne = (payload: OneEnvelope): BackendColumn =>
  (payload as { data?: BackendColumn }).data ?? (payload as BackendColumn);

export const fetchColumns = async (boardId: string): Promise<BackendColumn[]> => {
  const response = await apiClient.get<ListEnvelope>(`/${boardId}/columns`);
  return unwrapList(response.data);
};

export const createColumn = async (boardId: string, name: string): Promise<BackendColumn> => {
  const response = await apiClient.post<OneEnvelope>(`/${boardId}/columns`, { name });
  return unwrapOne(response.data);
};

export const renameColumn = async (boardId: string, columnId: string, name: string): Promise<BackendColumn> => {
  const response = await apiClient.patch<OneEnvelope>(`/${boardId}/columns/${columnId}`, { name });
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
  const response = await apiClient.patch<ListEnvelope>(`/${boardId}/columns/reorder`, { updates });
  return unwrapList(response.data);
};
