export type DeleteConfirmationModel = {
  isOpen: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
};