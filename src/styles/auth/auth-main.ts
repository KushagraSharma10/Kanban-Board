import styled from "styled-components";
import { colors } from "../theme";

export const AuthMain = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.darkBlue1};
  color: ${colors.brightGray};
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2rem 4rem;
  }

  @media (min-width: 1280px) {
    padding: 4rem 10.8rem;
  }
`;

export const AuthWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  display: flex;
  background-color: ${colors.darkBlue2};
  border-radius: 1rem;
`;

export const AuthContent = styled.div`
  width: 100%;
  padding: 3rem;
  background-color: ${colors.darkBlue2};

  @media (max-width: 426px) {
    padding: 1.5rem;
  }

  @media (max-width: 376px) {
    padding: 1rem;
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  p {
    color: ${colors.lightGray};
  }
`;

export const AuthBrand = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

export const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${colors.lightGray};
`;

export const AuthLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.balticSeaGray};
`;

export const AuthFooter = styled.p`
  font-size: 0.9rem;
  color: ${colors.grayishBlue};
  text-align: center;
  margin-top: 2rem;
`;

export const AuthRowRight = styled.p`
  text-align: right;
  margin-top: 1rem;
`;
