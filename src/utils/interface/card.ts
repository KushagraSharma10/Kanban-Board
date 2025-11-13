export interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  boardId: string;
  columnId: string;
  assigneeEmail?: string;
  label?: "none" | "low" | "moderate" | "high" | "urgent";
  createdBy: string;
}

export interface CardProps {
  card: CardData;
  onUpdate: (updatedCard: CardData) => void;
  onDelete: (id: string) => void;
  existingCards?: CardData[];
}