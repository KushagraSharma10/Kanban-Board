import styled from "styled-components";
import { colors, spacing } from "../theme";

export const AuthBrand = styled.h1`
  display: flex;
  align-items: center;
  gap: ${spacing.gapIcon};
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: ${spacing.marginBottomBrand};
`;

export const AuthHeading = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: ${spacing.marginBottomHeading};
`;

export const AuthSubText = styled.p`
  color: ${colors.textSecondary};
`;

export const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing.marginTopDivider} 0;
  gap: ${spacing.gapDivider};
  font-size: 0.9rem;
  color: ${colors.textSecondary};
`;

export const AuthLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.borderGray};
`;

export const AuthFooter = styled.p`
  font-size: 0.9rem;
  color: ${colors.textFooter};
  text-align: center;
  margin-top: ${spacing.marginTopFooter};
`;

export const AuthRowRight = styled.p`
  text-align: right;
  margin-top: ${spacing.marginTopRow};
`;
