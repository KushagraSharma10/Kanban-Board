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
import type { BoardItem, CardProp } from "../../utils/types/dashboard";

const BoardCard: React.FC<CardProp> = ({
  name,
  color,
  type,
  onAction
}: CardProp) => {
  const [menuOpen, setMenuOpen] = useState(false);

    const board: BoardItem = { id: "", name, type, color };

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
            <button
              onClick={() => {
                setMenuOpen(false);
                onAction("edit", board); 
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onAction("delete", board); 
              }}
            >
              Delete
            </button>
          </OptionsMenu>
        </OptionWrapper>
      )}
    </Card>
  );
};

export default BoardCard;
