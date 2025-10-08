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

const BoardCard: React.FC<BoardCardProp> = ({
  name,
  color,
  type,
  onEdit,
  onDelete,
  onOpen,
}: BoardCardProp) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleCardClick = () => {
    if (menuOpen) return setMenuOpen(false);
    onOpen?.();
  };
  const menuOptions = [
    { label: "Edit", action: onEdit },
    { label: "Delete", action: onDelete },
  ];

  const handleOptionClick = (action: (() => void) | undefined) => {
    setMenuOpen(false);
    action?.();
  };

  const handleThreeDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
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
  );
};

export default BoardCard;
