import styled from "styled-components";
import { colors, spacing } from "../theme";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.padding};
  color: ${colors.textLight};
  justify-content: space-between;
  border-bottom: 1px solid #28394e;
  flex-wrap: wrap;
`;
export const HeaderTop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
`;

export const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
    @media (max-width: 429px) {
    flex-wrap: nowrap; 
    overflow-x: auto;  
  }
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SearchInput = styled.input`
  max-width: 60%;
  margin-left: ${spacing.margin};
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  width: 21.875rem;
  color: ${colors.textLight};
  background-color: ${colors.searchBackground};

  @media (max-width: 768px) {
    margin-left: 0;
  }
    @media (max-width: 480px) {
    width: 70%;
    }
`;

export const Profile= styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  `;
  
  export const CreateButton = styled.button`
  margin-left: auto;
  padding: 0.5rem 1rem;
  background-color: ${colors.buttonPrimary};
  color: #000;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  
  @media (max-width: 429px) {
    font-size: 0.7rem;
    padding: 0.5rem 0.4rem;
  }
  `;
  
  export const UserAvatar = styled.img`
  margin-left: ${spacing.margin};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  background-color: transparent;
`;