import type { DragPayload } from "./types/drag-and-drop";
import type { DragEvent } from "react";

export const setDragData = (event: DragEvent, payload: DragPayload): void => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", JSON.stringify(payload));
};

export const getDragData = (event: DragEvent): DragPayload | null => {
  try {
    const dataString  = event.dataTransfer.getData("text/plain");
    if (!dataString ) return null;
    return JSON.parse(dataString) as DragPayload;
  } catch {
    return null;
  }
};

export const moveItemWithinList = <T>(
  items: T[],
  sourceIndex: number,
  destinationIndex: number
): T[] => {
  if (sourceIndex === destinationIndex) return items;

  const updatedItems = [...items];
  const [itemToMove] = updatedItems.splice(sourceIndex, 1);

  const validIndex = Math.max(0, Math.min(destinationIndex, updatedItems.length));
  updatedItems.splice(validIndex, 0, itemToMove);

  return updatedItems;
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
