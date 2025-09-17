import { useState } from "react";
import { BoardContent, BoardDetails, BoardName, Card, ColorDiv, ContentClip, OptionsMenu, ThreeDots, TypeName } from "../../styles/dashboard/board-card";

type Props = {
  name: string;
  color: string;
  type: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const BoardCard = ({ name, color, type, onEdit, onDelete }: Props) => {
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
        <OptionsMenu onClick={(e) => e.stopPropagation()}>
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
              if (confirm("Delete this board?")) onDelete?.();
            }}
          >
            Delete
          </button>
        </OptionsMenu>
      )}
    </Card>
  );
};

export default BoardCard;
