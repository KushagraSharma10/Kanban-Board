import { useState } from "react";
import { Backdrop, BoardContent, Card, ColorDiv, ContentClip, DotWrap, OptionsMenu, ThreeDots,
} from "../../styles/dashboard/board-card";
import type { BoardItem, CardProp } from "../../utils/types/dashboard";

const BoardCard: React.FC<cardProp> = ({ name, color, type, onEdit, onDelete, onOpen }: cardProp) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

   const handleCardClick = () => {
    if (menuOpen) return setMenuOpen(false);
    onOpen?.();                         
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
