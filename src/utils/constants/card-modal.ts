import type { CardData } from "../interface/card";

export const MAX_TITLE_LENGTH = 15;
export const LABEL_OPTIONS: Array<{ value: CardData["label"]; text: string }> = [
  { value: "none", text: "None" },
  { value: "low", text: "Low" },
  { value: "moderate", text: "moderate" },
  { value: "high", text: "High" },
  { value: "urgent", text: "Urgent" },
];