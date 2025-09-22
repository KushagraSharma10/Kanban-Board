export type BoardItem = {
  id: string;
  userId: string;
  name: string;
  type: string;
  color: string;
};

export type cardProp = {
  name: string;
  color: string;
  type: string;
  onEdit?: () => void;
  onOpen?: () => void;
  onDelete?: () => void;
};

export type boardModalProp = {
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
