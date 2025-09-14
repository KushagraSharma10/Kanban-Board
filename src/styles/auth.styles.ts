import styled from "styled-components";

export const AuthMain = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #0b0f14;
  color: #e6edf3;
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
  background-color: #161a21;
  border-radius: 1rem;
`;

export const AuthContent = styled.div`
  width: 100%;
  padding: 3rem;
  background-color: #161a21;

  @media (max-width: 426px) {
    padding: 1.5rem;
  }

  @media (max-width: 376px) {
    padding: 1rem;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

export const AuthInput = styled.input`
  border: 1px solid #3a3f44;
  outline: none;
  background-color: #0b0f14;
  color: #e6edf3;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;

  &::placeholder {
    color: #9e9e9e;
  }

  &:focus {
    border-color: #0096ff;
  }
`;

export const AuthButton = styled.button`
  border: 1px solid #0096ff;
  background-color: #0096ff;
  color: #000;
  padding: 0.9rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0096ff;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

export const FieldLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
`;

export const AuthBrand = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

export const AuthHeading = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const AuthSubText = styled.p`
  color: #9ca3af;
`;

export const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.1rem 0;
  gap: 1rem;
  font-size: 0.9rem;
  color: #9ca3af;
`;

export const AuthLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #3a3f44;
`;

export const GoogleBtn = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 0.9rem 1.2rem;
  border-radius: 8px;
  background-color: #1a1f27;
  color: #fff;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
`;

export const AuthFooter = styled.p`
  font-size: 0.9rem;
  color: #a3b1c2;
  text-align: center;
  margin-top: 1rem;
`;

export const AuthLink = styled.a`
  color: #6ca0ff;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
`;

export const AuthRowRight = styled.p`
  text-align: right;
  margin-top: 0.5rem;
`;

export const AuxLink = styled.a`
  font-size: 0.9rem;
  color: #6ca0ff;
  text-align: right;
  cursor: pointer;
  text-decoration: none;
`;
