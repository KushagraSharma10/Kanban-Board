import styled from "styled-components";
import { colors} from "../theme";

export const AuthInput = styled.input`
  border: 1px solid ${colors.balticSeaGray};
  outline: none;
  background-color: ${colors.darkBlue1};
  color: ${colors.brightGray};
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;

  &::placeholder {
    color: ${colors.spanishGray};
  }

  &:focus {
    border-color: ${colors.blue};
  }
`;
