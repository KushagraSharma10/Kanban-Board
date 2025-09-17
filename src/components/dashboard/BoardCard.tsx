import styled from "styled-components";

export const Card = styled.div`
  width: 18vw;
  min-height: 15vw;
  border-radius: 1.5rem;
  overflow: hidden;
  background-color: #151d27;
  cursor:pointer;

  // max-width: 250px; 
  // min-height: 200px;
  // border-radius: 1.5rem;
  // overflow: hidden;
  // background-color: #151d27;
  // cursor: pointer;
  // transition: transform 0.2s ease;

  
   @media (max-width: 1024px) {
    width: 30vw;
    min-height: 20vw;
  }

  @media (max-width: 768px) {
    width: 40vw;
    min-height: 25vw;
  }

  @media (max-width: 480px) {
    width: 90vw;
    min-height: 50vw;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export const Color = styled.div`
  width: 100%;
  height: 7vw;

   @media (max-width: 768px) {

   height:10vw
  }

  @media (max-width: 480px) {
    min-height: 20vw;
  }


`;

export const BoardContent = styled.div`
  padding: 1rem 1.1rem;
`;

export const BoardName = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
`;

export const TagName = styled.p`
  font-size: 0.9rem;
  color: rgb(80, 79, 79);
`;

type Props = {
  name: string;
  color: string;
  type: string;
};

const BoardCard = ({ name, color, type }: Props) => {
  return (
    <Card>
      <Color style={{backgroundColor: `${color}`}} />
      <BoardContent>
        <BoardName>{name}</BoardName>
        <TagName>{type}</TagName>
      </BoardContent>
    </Card>
  );
};

export default BoardCard;
