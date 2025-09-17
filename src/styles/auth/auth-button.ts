import styled from "styled-components";
import { colors } from "../theme";

export const AuthButton = styled.button`
  border: 1px solid ${colors.blue};
  background-color: ${colors.blue};
  color: #000;
  padding: 0.9rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${colors.blue};
  }
`;
