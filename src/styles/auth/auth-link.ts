import styled from "styled-components";
import { theme } from "../theme";

export const AuthLink = styled.a`
  color: ${theme.colors.brightBlue};
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
`;

export const AuxLink = styled.a`
  font-size: 0.9rem;
  color: ${theme.colors.brightBlue};
  text-align: right;
  cursor: pointer;
  text-decoration: none;
`;
