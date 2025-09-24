import styled from "styled-components";
import { colors } from "../theme";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: .5rem;
  color: ${colors.brightGray};
  justify-content: space-between;
  border-bottom: 1px solid ${colors.balticSeaGray};
  flex-wrap: wrap;
  background-color: ${colors.darkBlue1};
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
`;

export const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    width: 100%;
  }
  @media (max-width: 480px) {
    width: 70%;
  }
  @media (max-width: 429px) {
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
  border: 1px solid ${colors.balticSeaGray};
  outline: none;
  width: 21.875rem;
  color: ${colors.brightGray};
  background-color: ${colors.darkBlue3};

  &::placeholder {
    color: ${colors.spanishGray};
  }
  &:focus {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 3px rgba(0, 150, 255, 0.2);
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
  @media (max-width: 480px) {
    width: 70%;
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    margin-left: auto;
    padding: 0.5rem 1rem;
    background-color: ${colors.blue};
    color: #000;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      filter: brightness(1.05);
    }
    &:focus-visible {
      outline: 2px solid ${colors.brightBlue};
    }

    @media (max-width: 425px) {
      font-size: 0.7rem;
      padding: 0.5rem 0.4rem;
    }
  }

  img {
    margin-left: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;
    background-color: transparent;
  }
`;
