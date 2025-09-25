import styled from "styled-components";
import { theme } from "../theme";
import { breakpoints } from "../../utils/constants/breakpoints";

export const PanelContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.darkBlue4};
  padding: 2rem;
  color: ${theme.colors.brightGray};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

export const Icon = styled.svg`
  width: 50%;
  color: ${theme.boardColors[0]};
`;

export const ContentHeading = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

export const Content = styled.div`
  text-align: center;
`;

export const ContentSubText = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: ${theme.colors.neutralGray};
  margin-top: 0.8rem;
  line-height: 1.7rem;
`;
