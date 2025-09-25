import { BsThreeDotsVertical } from "react-icons/bs";
import styled from "styled-components";
import { breakpoints } from "../../utils/constants/breakpoints";
import { theme } from "../theme";

export const ThreeDots = styled(BsThreeDotsVertical)`
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
`;

export const Card = styled.div`
  width: 20vw;
  border-radius: 1.5rem;
  background-color: ${theme.colors.darkBlue2};
  cursor: pointer;
  position: relative;

  &:hover ${ThreeDots} {
    opacity: 1;
  }

  @media (max-width: ${breakpoints.laptop}) {
    width: 30vw;
    min-height: 20vw;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 45vw;
    min-height: 30vw;
  }

  @media (max-width: ${breakpoints.mobileM}) {
    width: 100%;
    min-height: 46vw;
  }
`;

export const ContentClip = styled.div`
  border-radius: inherit;
  overflow: hidden;
  background: inherit;
`;


export const ColorDiv = styled.div<{ $bg: string }>`
  width: 100%;
  height: 7vw;
  background-color: ${({ $bg }) => $bg};

  @media (max-width: ${breakpoints.tablet}) {
    height: 15vw;
  }

  @media (max-width: ${breakpoints.mobileM}) {
    width: 100%;
    min-height: 20vw;
  }
`;

export const BoardContent = styled.div`
  padding: 1.4rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    font-size: 0.9rem;
    margin-top: 0.2rem;
    color: ${theme.colors.lightGray};
  }

  .details {
    padding: 0rem 0.2rem;
  }
`;

export const DotWrap = styled.div`
  position: relative;
`

export const OptionWrapper = styled.div`
  position:relative;
`

export const OptionsMenu = styled.div`
  position: absolute;
  top: -2.5rem;
  right: 1.6rem;
  background-color: ${theme.colors.darkBlue3};
  border: 1px solid ${theme.colors.balticSeaGray};
  overflow: hidden;
  z-index: 999;
  min-width: 6vw;
  display: flex;
  flex-direction: column;
  border-radius:.2rem;

  button {
    padding: 0.6rem 1rem;
    background: none;
    border: none;
    color: white;
    text-align: left;
    font-size: 0.9rem;
    cursor: pointer;

    &:hover {
      background-color: #374151;
    }
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: transparent;
  z-index: 998;
`;
