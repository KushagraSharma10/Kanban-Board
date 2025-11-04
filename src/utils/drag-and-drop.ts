import type { DragPayload } from "./types/drag-and-drop";
import type { DragEvent } from "react";

export const setDragData = (event: DragEvent, payload: DragPayload): void => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", JSON.stringify(payload));
};

export const getDragData = (event: DragEvent): DragPayload | null => {
  try {
    const text = event.dataTransfer.getData("text/plain");
    if (!text) return null;
    return JSON.parse(text) as DragPayload;
  } catch {
    return null;
  }
};

export const moveItemWithinList = <T>(
  list: T[],
  fromIndex: number,
  toIndex: number
): T[] => {
  if (fromIndex === toIndex) return list;
  if (fromIndex < 0 || fromIndex >= list.length) return list;
  const next = [...list];
  const [movedItem] = next.splice(fromIndex, 1);
  const safeIndex = Math.max(0, Math.min(toIndex, next.length));
  next.splice(safeIndex, 0, movedItem);
  return next;
};

export const reorderById = <T extends { id: string }>(
  list: T[],
  sourceId: string,
  targetId: string | null,
  position: "before" | "after" | "end" = "before"
): T[] => {
  const sourceIndex = list.findIndex((item) => item.id === sourceId);
  if (sourceIndex === -1) return list;

  if (position === "end" || targetId === null) {
    return moveItemWithinList(list, sourceIndex, list.length);
  }

  const targetIndex = list.findIndex((item) => item.id === targetId);
  if (targetIndex === -1) return list;

  const intendedIndex = position === "before" ? targetIndex : targetIndex + 1;
  const adjustedIndex =
    sourceIndex < targetIndex ? intendedIndex - 1 : intendedIndex;
  return moveItemWithinList(list, sourceIndex, adjustedIndex);
};
