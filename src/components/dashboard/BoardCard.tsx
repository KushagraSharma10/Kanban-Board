import { useState } from "react";
import {
  Backdrop,
  BoardContent,
  BoardDetails,
  BoardName,
  Card,
  ColorDiv,
  ContentClip,
  OptionsMenu,
  ThreeDots,
  TypeName,
} from "../../styles/dashboard/board-card";
import type { cardProp } from "../../types/dashboard";

const BoardCard = ({ name, color, type, onEdit, onDelete }: cardProp) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card onClick={() => setMenuOpen(false)}>
      <ContentClip>
        <ColorDiv style={{ backgroundColor: color }} />
        <BoardContent>
          <BoardDetails>
            <BoardName>{name}</BoardName>
            <TypeName>{type}</TypeName>
          </BoardDetails>

          <div style={{ position: "relative" }}>
            <ThreeDots
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
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
