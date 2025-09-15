import styled from "styled-components";
import { spacing } from "../theme";

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.gapForm};
  margin-top: ${spacing.marginTopForm};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.gapField};
`;

export const FieldLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
`;
