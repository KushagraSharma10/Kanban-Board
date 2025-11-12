import { apiClient } from "../lib/apiClient";
import { getActiveUserId } from "../utils/auth";

export const isBoardAdmin = async(boardId: string): Promise<boolean> => {
  try {
    const currentUserId = getActiveUserId();
    if (!currentUserId) return false;

    const res = await apiClient.get<{ data: { createdBy: string; members?: Array<{ user: string; roles?: string[] }> } }>(
      `/boards/${boardId}`
    );

    const board = res.data?.data;
    if (!board) return false;

    if (board.createdBy === currentUserId) return true; 

    const currentMember  = board.members?.find(m => String(m.user) === String(currentUserId));
    return !!currentMember?.roles?.includes("admin");
  } catch {
    return false;
  }
}
