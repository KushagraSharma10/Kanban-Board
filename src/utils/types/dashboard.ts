export type BoardItem = {
  id: string;
  name: string;
  type: string;
  color: string;
};
export type CardProp = {
  name: string;
  color: string;
  type: string;
  onEdit?: () => void;
  onOpen?: () => void;
  onDelete?: () => void;
};

export type BoardModalProp = {
  open: boolean;
  mode?: "create" | "edit";
  board?: BoardItem;
  onClose: () => void;
  onCreate: (data: { name: string; type: string; color: string }) => void;
  onUpdate?: (
    id: string,
    data: { name: string; type: string; color: string }
  ) => void;
};
