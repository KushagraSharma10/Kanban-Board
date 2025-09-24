import styled from "styled-components";
import { colors } from "../theme";
import { breakpoints } from "../../constants/breakpoints";

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
  background-color: #0f1622;
  border: 1px solid #223145;
  box-shadow: 0 20px 60px #00000059;
  padding: 1.2rem;
  color: #e6edf3;

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
  }

  button {
    background-color: transparent;
    border: none;
    font-size: 1.6rem;
    color: #9fb1cc;
    cursor: pointer;
    &:hover {
      color: #fff;
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
    color: ${colors.iceBlue};
  }

  input,
  select {
    background-color: ${colors.blackPearl};
    border: 1px solid ${colors.bluishBlack};
    border-radius: 10px;
    padding: 0.6rem 0.7rem;
    color: ${colors.brightGray};
    &:focus {
      border-color: ${colors.brightBlue};
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
    $active ? "2px solid #fff" : `2px solid ${colors.bluishBlack}`};

  @media (max-width: ${breakpoints.tablet}) {
    width: 4vw;
    height: 4vw;
  }

  @media (max-width: ${breakpoints.mobileM}) {
    width: 6vw;
    height: 6vw;
  }
`;

export const ColorInput = styled.input`
  width: 4vw;
  height: 2.2vw;
  border-radius: 0.3rem;
  border: 1px solid ${colors.bluishBlack};

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
export const Primary = styled.button`
  background-color: ${colors.brightBlue};
  border: none;
  color: #000;
  font-weight: 700;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;
export const Secondary = styled.button`
  background-color: ${colors.blackPearl};
  border: 1px solid ${colors.bluishBlack};
  color: ${colors.iceBlue};
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;
