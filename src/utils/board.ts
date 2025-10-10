import type { BoardForm, BoardItem } from "./types/dashboard";

export const validateBoardForm = (
  allBoards: BoardItem[],
  userId: string,
  boardId: string | null,
  form: BoardForm
): string | null => {
  const normalizedName = normalizeBoardName(form.name);

  if (!normalizedName) {
    return "Please enter a board name.";
  }

  const isDuplicate = allBoards
    .filter((board) => board.userId === userId)
    .some(
      (board) =>
        (boardId === null || board.id !== boardId) &&
        normalizeBoardName(board.name) === normalizedName
    );

  if (isDuplicate) {
    return "A board with this name already exists.";
  }

  return null;
}

export function normalizeBoardName(name: string): string {
  return name.trim().split(" ").filter(Boolean).join(" ").toLowerCase();
}