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

export const GoogleBtn = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.gapGoogle};
  width: 100%;
  padding: ${spacing.paddingGoogle};
  border-radius: 8px;
  background-color: ${colors.buttonGoogleBg};
  color: ${colors.buttonGoogleText};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
`;
