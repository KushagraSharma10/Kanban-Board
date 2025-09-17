import styled from "styled-components";

export const Main = styled.div`
  width: 100%;
  background-color: #0b0f14;
  color: white;
`;
export const Board = styled.div`
  display: flex;
  min-height: calc(100vh - 5.4vw);
`;
export const Sidebar = styled.div`
  width: 20vw;
  border-right: 1px solid #28394e;
`;
export const BoardArea = styled.div`
  flex: 1;
  padding: 2vw;
    @media (max-width: 768px) {
    padding: 1.5vw;
  }

  @media (max-width: 480px) {
    padding: 1vw;
  }
`;
export const Cards = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
`;
export const NoBoards = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9aa4af;
  font-size: 1.1rem;
`;
export const CreateBoard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15vw;
  height: 15vw;
  border-radius: 1.5rem;
  border: 3px dotted #28394e;
  font-size: 1.2rem;
  cursor: pointer;

   @media (max-width: 1024px) {
    width: 20vw;
    height: 20vw;
  }

  @media (max-width: 768px) {
    width: 30vw;
    height: 30vw;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 50vw;
  }
`;
