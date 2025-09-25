import styled from "styled-components";
import { breakpoints } from "../../utils/constants/breakpoints";
import { theme } from "../theme";

export const Main = styled.div`
  width: 100%;
  background-color: ${theme.colors.darkBlue1};
  color: ${theme.colors.brightGray};
`;
export const Board = styled.div`
  display: flex;
  min-height: calc(100vh - 5.4vw);
`;

export const BoardArea = styled.div`
  flex: 1;
  padding: 1.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1.5vw;
  }

  @media (max-width: ${breakpoints.mobileM}) {
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

export const Query = styled.b`
  font-weight: 700;
`;

export const CreateBoard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19vw;
  height: 14vw;
  border-radius: 1.5rem;
  border: 0.1875rem dotted #28394e; /* 3px → 0.1875rem */
  font-size: 1.2rem;
  cursor: pointer;

  @media (max-width: ${breakpoints.laptop}) {
    width: 20vw;
    height: 20vw;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 30vw;
    height: 30vw;
  }

  @media (max-width: ${breakpoints.mobileM}) {
    width: 100%;
    height: 50vw;
  }
`;
