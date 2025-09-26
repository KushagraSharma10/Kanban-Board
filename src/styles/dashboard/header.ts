import styled from "styled-components";
import { theme } from "../theme";
import { breakpoints } from "../../utils/constants/breakpoints";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: ${theme.colors.brightGray};
  justify-content: space-between;
  border-bottom: 1px solid ${theme.colors.balticSeaGray};
  flex-wrap: wrap;
  background-color: ${theme.colors.darkBlue1};
`;

export const HeaderLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;

  button {
    margin-left: auto;
    padding: 0.5rem 1rem;
    background-color: ${theme.colors.blue};
    color: #000;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      filter: brightness(1.05);
    }
    &:focus-visible {
      outline: 2px solid ${theme.colors.brightBlue};
    }

    @media (max-width: ${breakpoints.mobileS}) {
      font-size: 0.7rem;
      padding: 0.5rem 0.4rem;
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    flex-wrap: wrap;
    width: 100%;
  }
  @media (max-width: ${breakpoints.mobileM}) {
    width: 70%;
  }
  @media (max-width: ${breakpoints.mobileS}) {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 2.5vw;
    display: block;
  }
`;

export const SearchInput = styled.input`
  max-width: 60%;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${theme.colors.balticSeaGray};
  outline: none;
  width: 21.875rem;
  color: ${theme.colors.brightGray};
  background-color: ${theme.colors.darkBlue3};

  &::placeholder {
    color: ${theme.colors.spanishGray};
  }
  &:focus {
    border-color: ${theme.colors.blue};
    box-shadow: 0 0 0 3px #0096ff33;
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
  }
  @media (max-width: ${breakpoints.mobileM}) {
    width: 70%;
  }
`;
