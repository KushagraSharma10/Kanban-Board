import type { CardData } from "../utils/interface/card";

const STORAGE_KEY = "cards";

export const loadCards = (): CardData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) as CardData[] : [];
};

export const saveCards = (cards: CardData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};
