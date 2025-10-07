import styled from "styled-components";
import { theme } from "../theme";

export const AuthButton = styled.button`
  border: 1px solid ${theme.colors.blue};
  background-color: ${theme.colors.blue};
  color: #000;
  padding: 0.9rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.blue};
  }
`;
