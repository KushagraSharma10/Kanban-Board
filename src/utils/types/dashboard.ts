export type BoardItem = {
  id: string;
  userId: string;
  name: string;
  type: string;
  color: string;
};

export type BoardsState = {
  items: BoardItem[];
};

export type BoardCardProp = {
  name: string;
  color: string;
  type: string;
  onEdit?: () => void;
  onOpen?: () => void;
  onDelete?: () => void;
};

export type BoardForm = {
  name: string;
  type: string;
  color: string;
};

export type BoardModalProp = {
  open: boolean;
  mode?: "create" | "edit";
  board?: BoardItem;
  onClose: () => void;
  onCreate: (data: BoardForm) => void;
  onUpdate?: (id: string, data: BoardForm) => void;
};
