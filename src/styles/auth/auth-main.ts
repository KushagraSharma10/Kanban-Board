import styled from "styled-components";
import { colors, spacing } from "../theme";

export const AuthMain = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.backgroundDark};
  color: ${colors.textLight};
  padding: ${spacing.paddingMain};

  @media (min-width: 768px) {
    padding: ${spacing.paddingMainMd};
  }

  @media (min-width: 1280px) {
    padding: ${spacing.paddingMainLg};
  }
`;

export const AuthWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  display: flex;
  background-color: ${colors.backgroundSecondary};
  border-radius: 1rem;
`;

export const AuthContent = styled.div`
  width: 100%;
  padding: ${spacing.paddingContent};
  background-color: ${colors.backgroundSecondary};

  @media (max-width: 426px) {
    padding: ${spacing.paddingContentMd};
  }

  @media (max-width: 376px) {
    padding: ${spacing.paddingContentSm};
  }
`;
