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
import type { cardProp } from "../../types/dashboard";

const BoardCard = ({ name, color, type, onEdit, onDelete }: cardProp) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
              style={{ cursor: "pointer" }}
            />
          </DotWrap>
        </BoardContent>
      </ContentClip>
      {menuOpen && (
        <>
          <Backdrop onClick={() => setMenuOpen(false)} />
          <OptionsMenu>
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit?.();
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete?.();
              }}
            >
              Delete
            </button>
          </OptionsMenu>
        </>
      )}
    </Card>
  );
};

export default BoardCard;
