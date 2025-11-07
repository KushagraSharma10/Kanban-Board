import { apiClient } from "../lib/apiClient";
import { getActiveUserId } from "../utils/session";

export async function isBoardAdmin(boardId: string): Promise<boolean> {
  try {
    const myId = getActiveUserId();
    if (!myId) return false;

    const res = await apiClient.get<{ data: { createdBy: string; members?: Array<{ user: string; roles?: string[] }> } }>(
      `/boards/${boardId}`
    );

    const board = res.data?.data;
    if (!board) return false;

    if (String(board.createdBy) === String(myId)) return true; 

    const me = board.members?.find(m => String(m.user) === String(myId));
    return !!me?.roles?.includes("admin");
  } catch {
    return false;
  }
}
