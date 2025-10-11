import { useState } from "react";
import {
  Backdrop,
  BoardContent,
  Card,
  ColorDiv,
  ContentClip,
  DotWrap,
  OptionsMenu,
  ThreeDots,
} from "../../styles/dashboard/board-card";
import type { BoardCardProp } from "../../utils/types/dashboard";
import DeleteConfirmation from "../DeleteConfirmation";

const BoardCard: React.FC<BoardCardProp> = ({
  name,
  color,
  type,
  onEdit,
  onDelete,
  onOpen,
}: BoardCardProp) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isConfirmingDeletion, setIsConfirmingDeletion] =
    useState<boolean>(false);

  const handleCardClick = () => {
    if (menuOpen) return setMenuOpen(false);
    onOpen?.();
  };
  const handleThreeDotsClick = (mouseEvent: React.MouseEvent): void => {
    mouseEvent.stopPropagation();
    setMenuOpen((wasOpen) => !wasOpen);
  };

  const handleEditClick = (): void => {
    setMenuOpen(false);
    onEdit?.();
  };

  const handleDeleteClick = (): void => {
    setMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDeletion = (): void => setIsDeleteModalOpen(false);

  const handleConfirmDeletion = async (): Promise<void> => {
    try {
      setIsConfirmingDeletion(true);
      onDelete?.();
    } finally {
      setIsConfirmingDeletion(false);
      setIsDeleteModalOpen(false);
    }
  };

  const menuOptions = [
    { label: "Edit", action: handleEditClick },
    { label: "Delete", action: handleDeleteClick },
  ];

  const handleOptionClick = (action: () => void): void => {
    action();
  };

  return (
    <>
      <Card onClick={handleCardClick}>
        <ContentClip>
          <ColorDiv $bg={color} />
          <BoardContent>
            <div className="details">
              <h2>{name}</h2>
              <p>{type}</p>
            </div>
            <DotWrap>
              <ThreeDots size={20} onClick={handleThreeDotsClick} />
            </DotWrap>
            {menuOpen && (
              <>
                <Backdrop onClick={() => setMenuOpen(false)} />
                <OptionsMenu>
                  {menuOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleOptionClick(option.action)}
                      className={`px-3 py-2 text-left text-sm hover:bg-[#141b26] ${
                        option.label === "Delete" ? "text-red-400" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </OptionsMenu>
              </>
            )}
          </BoardContent>
        </ContentClip>
      </Card>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        itemName={name}
        onCancel={handleCancelDeletion}
        onConfirm={handleConfirmDeletion}
        isConfirming={isConfirmingDeletion}
      />
    </>
  );
};

export default BoardCard;
