import type { BackendBoard } from "./types/board";
import type { BoardItem } from "./types/dashboard";

export const toBoardItem = (backend: BackendBoard): BoardItem => ({
  id: backend._id,
  userId: backend.createdBy,
  name: backend.name,
  type: backend.type,
  color: backend.color,
});
