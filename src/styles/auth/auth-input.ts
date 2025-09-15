import styled from "styled-components";
import { colors, spacing } from "../theme";

export const AuthInput = styled.input`
  border: 1px solid ${colors.borderGray};
  outline: none;
  background-color: ${colors.backgroundDark};
  color: ${colors.textLight};
  padding: ${spacing.paddingInput};
  border-radius: 0.5rem;
  font-size: 1rem;

  &::placeholder {
    color: ${colors.textPlaceholder};
  }

  &:focus {
    border-color: ${colors.borderFocus};
  }
`;
