import { apiClient } from "../../lib/apiClient";
import type { Envelope } from "../../utils/interface/auth";
import type { BackendBoard, CreateBoardPayload, UpdateBoardPayload } from "../../utils/types/board";


export const fetchBoards = async (): Promise<BackendBoard[]> => {
  const response = await apiClient.get<Envelope<BackendBoard[]>>("/boards");
  const body = response.data;
  return Array.isArray(body) ? body : body.data;
};

export const createBoard = async (
  payload: CreateBoardPayload
): Promise<BackendBoard> => {
  const response = await apiClient.post<Envelope<BackendBoard>>(
    "/boards",
    payload
  );
  const body = response.data as { data?: BackendBoard } | BackendBoard;
  return (body as { data?: BackendBoard }).data ?? (body as BackendBoard);
};

export const fetchBoardById = async (
  boardId: string
): Promise<BackendBoard> => {
  const response = await apiClient.get<Envelope<BackendBoard>>(
    `/boards/${boardId}`
  );
  const body = response.data as { data?: BackendBoard } | BackendBoard;
  return (body as { data?: BackendBoard }).data ?? (body as BackendBoard);
};

export const updateBoard = async (
  boardId: string,
  payload: UpdateBoardPayload
): Promise<BackendBoard> => {
  const response = await apiClient.patch<Envelope<BackendBoard>>(
    `/boards/${boardId}`,
    payload
  );
  const body = response.data as { data?: BackendBoard } | BackendBoard;
  return (body as { data?: BackendBoard }).data ?? (body as BackendBoard);
};

export const deleteBoard = async (boardId: string): Promise<boolean> => {
  const response = await apiClient.delete(`/boards/${boardId}`);
  return response.status === 200 || response.status === 204;
};
