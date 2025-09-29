import type { CardData } from "./interface/card";

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
