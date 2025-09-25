import styled from "styled-components";
import { breakpoints } from "../../utils/constants/breakpoints";
export const PanelContainer = styled.div`
  width: 100%;
  background-color: #181c24;
  padding: 2rem;
  color: #e6edf3;
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
  color: #3b82f6;

  rect {
    stroke: currentColor;
    stroke-width: 2;
  }

  line {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
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
  color: #bdbdbd;
  margin-top: 0.8rem;
  line-height: 1.7rem;
`;
