import styled from "styled-components";
import { colors } from "../theme";

export const Main = styled.div`
  width: 100%;
  background-color: ${colors.darkBlue1};
  color: ${colors.brightGray};
`;

export const Board = styled.div`
  display: flex;
  min-height: calc(100vh - 5.4vw);
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
  color: ${colors.lightGray};
  font-size: 1.1rem;
`;

export const Query = styled.b`
  font-weight: 700;
  color: ${colors.brightGray};
`;

export const CreateBoard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19vw;
  height: 14vw;
  border-radius: 1.5rem;
  border: 3px dotted ${colors.balticSeaGray};
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
