import type { CardData } from "./card";

export interface CardModalProps {
  card: CardData;
  onSave: (card: CardData) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  existingCards?: CardData[];
}