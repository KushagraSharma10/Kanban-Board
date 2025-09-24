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
import type { CardProp } from "../../types/dashboard";
import { MENU_OPTIONS } from "../../constants/board-card";

const BoardCard = ({ name, color, type, onEdit, onDelete }: CardProp) => {
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
  {MENU_OPTIONS.map((options) => (
    <button
      key={options.label}
      onClick={() => {
        setMenuOpen(false);
        if (options.label === "Edit") options.action(onEdit);
        if (options.label === "Delete") options.action(onDelete);
      }}
    >
      {options.label}
    </button>
  ))}
</OptionsMenu>
        </>
      )}
    </Card>
  );
};

export default BoardCard;
