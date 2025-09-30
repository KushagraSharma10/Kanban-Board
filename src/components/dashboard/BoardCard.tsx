import { useState } from "react";
import {
  Backdrop,
  BoardContent,
  Card,
  ColorDiv,
  ContentClip,
  DotWrap,
  OptionsMenu,
  OptionWrapper,
  ThreeDots,
} from "../../styles/dashboard/board-card";
import type { CardProp } from "../../utils/types/dashboard";

const BoardCard: React.FC<CardProp> = ({
  name,
  color,
  type,
  onEdit,
  onDelete,
}: CardProp) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuOptions = [
    { label: "Edit", action: onEdit },
    { label: "Delete", action: onDelete },
  ];

  return (
    <Card onClick={() => setMenuOpen(false)}>
      <ContentClip>
        <ColorDiv $bg={color} />
        <BoardContent>
          <div className="details">
            <h2>{name}</h2>
            <p>{type}</p>
          </div>
          <DotWrap>
            <ThreeDots
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
            />
          </DotWrap>
        </BoardContent>
      </ContentClip>

      {menuOpen && (
        <OptionWrapper>
          <Backdrop onClick={() => setMenuOpen(false)} />
          <OptionsMenu>
            {menuOptions.map((option) => (
              <button
                key={option.label} 
                onClick={() => {
                  setMenuOpen(false);
                  option.action?.();
                }}
              >
                {option.label}
              </button>
            ))}
          </OptionsMenu>
        </OptionWrapper>
      )}
    </Card>
  );
};

export default BoardCard;
