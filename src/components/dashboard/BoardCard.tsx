import { BsThreeDotsVertical } from "react-icons/bs";
import styled from "styled-components";
import { useState } from "react";

const ThreeDots = styled(BsThreeDotsVertical)`
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

export const Card = styled.div`
  width: 18vw;
  border-radius: 1.5rem;             
  background-color: #151d27;
  cursor: pointer;
  position: relative;            

  &:hover ${ThreeDots} {
    opacity: 1;
  }
`;

const ContentClip = styled.div`
  border-radius: inherit;         
  overflow: hidden;               
  background: inherit;            
`;

export const BoardDetails = styled.div`
  padding: 0rem 0.2rem;
`;

export const Color = styled.div`
  width: 100%;
  height: 7vw;

`;

export const BoardContent = styled.div`
  padding: 1.4rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BoardName = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
`;

export const TypeName = styled.p`
  font-size: 0.9rem;
  margin-top: 0.2rem;
  color: rgba(112, 110, 110, 1);
`;

const OptionsMenu = styled.div`
  position: absolute;
  top: 9rem;
  right: 1rem;
  background: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 999;                  
  min-width: 120px;
  display: flex;
  flex-direction: column;

  button {
    padding: 0.6rem 1rem;
    background: none;
    border: none;
    color: white;
    text-align: left;
    font-size: 0.9rem;
    cursor: pointer;

    &:hover {
      background: #374151;
    }
  }
`;

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
        <Color style={{ backgroundColor: color }} />
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
