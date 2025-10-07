import styled from "styled-components";
import { theme } from "../theme";

export const AuthInput = styled.input`
  border: 1px solid ${theme.colors.balticSeaGray};
  outline: none;
  background-color: ${theme.colors.darkBlue1};
  color: ${theme.colors.brightGray};
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;

  &::placeholder {
    color: ${theme.colors.spanishGray};
  }

  &:focus {
    border-color: ${theme.colors.blue};
  }
`;
