import type { CardData } from "../components/card/Card";
import type { ColumnItem } from "../pages/BoardView";

export function loadFromStorage(key: string, defaultValue: unknown) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save data:", error);
  }
}

export const loadCards = (): CardData[] => {
  const data = localStorage.getItem("kanban-cards");
  return data ? JSON.parse(data) : [];
};

export const saveCards = (cards: CardData[]) => {
  localStorage.setItem("kanban-cards", JSON.stringify(cards));
};

export const loadColumns = (boardId: string): ColumnItem[] => {
  const data = localStorage.getItem(`kanban-columns-${boardId}`);
  return data ? JSON.parse(data) : [];
};

export const saveColumns = (boardId: string, columns: ColumnItem[]) => {
  localStorage.setItem(`kanban-columns-${boardId}`, JSON.stringify(columns));
};
