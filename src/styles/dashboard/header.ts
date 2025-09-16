import styled from "styled-components";
import { colors, spacing } from "../theme";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.padding};
  color: ${colors.textPrimary};
  justify-content: space-between;
  border-bottom: 1px solid #28394e;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const SearchInput = styled.input`
  margin-left: ${spacing.margin};
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  width: 350px;
  background-color: ${colors.searchBackground};
`;

export const Profile= styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  `;
  
  export const CreateButton = styled.button`
  margin-left: auto;
  padding: 0.5rem 1rem;
  background-color: ${colors.accent};
  color: #000;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  `;
  
  export const UserAvatar = styled.img`
  margin-left: ${spacing.margin};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  background-color: transparent;
`;