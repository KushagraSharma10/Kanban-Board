import styled from "styled-components";
import { colors, spacing } from "../theme";

export const AuthButton = styled.button`
  border: 1px solid ${colors.buttonPrimary};
  background-color: ${colors.buttonPrimary};
  color: #000;
  padding: ${spacing.paddingButton};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${colors.buttonPrimary};
  }
`;
