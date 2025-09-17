import styled from "styled-components";

export const Card = styled.div`
  width: 20vw;
  min-height: 15vw;
  border-radius: 1.5rem;
  overflow: hidden;
  background-color: #151d27;
  cursor:pointer;

   @media (max-width: 1024px) {
    width: 30vw;
    min-height: 20vw;
  }

  @media (max-width: 768px) {
    width: 45vw;
    min-height: 30vw;
  }

  @media (max-width: 480px) {
    width: 2vw;
    min-height: 50vw;
  }
`;

export const Color = styled.div`
  width: 100%;
  height: 7vw;
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
