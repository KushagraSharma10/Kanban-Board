export const MENU_OPTIONS = [
  {
    label: "Edit",
    action: (onEdit?: () => void) => onEdit?.(),
  },
  {
    label: "Delete",
    action: (onDelete?: () => void) => onDelete?.(),
  },
];