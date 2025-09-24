import styled from "styled-components";
import { theme } from "../theme";
import { breakpoints } from "../../utils/constants/breakpoints";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: #80000000;
  display: grid;
  place-items: center;
  padding: 1.4rem;
  z-index: 1000;
`;

export const Dialog = styled.div`
  width: 100%;
  max-width: 40vw;
  border-radius: 1rem;
  background-color: ${theme.colors.darkBlue2};
  border: 1px solid ${theme.colors.balticSeaGray};
  box-shadow: 0 20px 60px #00000059;
  padding: 1.2rem;
   color: ${theme.colors.brightGray};

  @media (max-width: ${breakpoints.tablet}) {
    max-width: 80vw;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${theme.colors.brightGray};
  }

  button {
    background-color: transparent;
    border: none;
    font-size: 1.6rem;
    color: ${theme.colors.grayishBlue};
    cursor: pointer;

    &:hover {
      color: ${theme.colors.brightGray};
    }
    &:focus-visible {
      outline: 2px solid ${theme.colors.blue};
      border-radius: 0.4rem;
    }
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 0.9rem;
`;

export const Field = styled.div`
  display: grid;
  gap: 0.5rem;

  h2 {
    font-size: 0.9rem;
    color: ${theme.colors.iceBlue};
  }

  input,
  select {
    background-color: ${theme.colors.blackPearl};
    border: 1px solid ${theme.colors.bluishBlack};
    border-radius: 10px;
    padding: 0.6rem 0.7rem;
    color: ${theme.colors.brightGray};

    &::placeholder {
      color: ${theme.colors.spanishGray};
    }

    &:focus {
      border-color: ${theme.colors.blue};
      box-shadow: 0 0 0 3px rgba(0, 150, 255, 0.2);
      outline: none;
    }
  }
`;

export const ColorOptions = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

export const ColorCircle = styled.button<{ $bg: string; $active?: boolean }>`
  width: 2vw;
  height: 2vw;
  border-radius: 1rem;
  cursor: pointer;
  background-color: ${({ $bg }) => $bg};
  border: ${({ $active }) =>
    $active ? "2px solid #fff" : `2px solid ${theme.colors.bluishBlack}`};

  @media (max-width: ${breakpoints.tablet}) {
    width: 4vw;
    height: 4vw;
  }

  @media (max-width: ${breakpoints.mobileM}) {
    width: 6vw;
    height: 6vw;
  }

  &:focus-visible {
    outline: 2px solid ${colors.blue};
    outline-offset: 2px;
  }
`;

export const ColorInput = styled.input`
  width: 4vw;
  border-radius: 0.3rem;
  height: 3vw;
  border: 1px solid ${theme.colors.balticSeaGray};
  background-color: ${theme.colors.darkBlue3};
  color: ${theme.colors.brightGray};

  @media (max-width: ${breakpoints.tablet}) {
    width: 6vw;
    height: 3vw;
  }

  @media (max-width: ${breakpoints.mobileM}) {
    width: 8vw;
    height: 4vw;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
`;

export const Button = styled.button`
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 700;

  &.primary {
    background-color: ${theme.colors.blue};
    border: none;
    color: #000;
  }

  &.secondary {
    background-color: ${theme.colors.darkBlue3};
    border: 1px solid ${theme.colors.bluishBlack};
    color: ${theme.colors.iceBlue};
    font-weight: 400; 
  }
    &:hover {
    filter: brightness(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${colors.brightBlue};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: none; 
  }
`;
