import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: #80000000;
  display: grid;
  place-items: center;
  padding: 1.4rem;
  z-index: 1000;
`;

export const Dialog = styled.div`
  width: 100%;
  max-width: 40vw;
  border-radius: 1rem;
  background-color: #0f1622;
  border: 1px solid #223145;
  box-shadow: 0 20px 60px #00000059;
  padding: 1.2rem;
  color: #e6edf3;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
`;

export const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
`;
export const CloseBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.6rem;
  color: #9fb1cc;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 0.9rem;
`;
export const Field = styled.div`
  display: grid;
  gap: 0.5rem;
`;
export const Label = styled.label`
  font-size: 0.9rem;
  color: #c7d2e1;
`;

export const Input = styled.input`
  background-color: #0b121a;
  border: 1px solid #2a3b4f;
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  color: #e6edf3;
  &:focus {
    border-color: #3b82f6;
  }
`;

export const Select = styled.select`
  background-color: #0b121a;
  border: 1px solid #2a3b4f;
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  color: #e6edf3;
  &:focus {
    border-color: #3b82f6;
  }
`;

export const ColorOptions = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

export const ColorCircle = styled.button`
  width: 2vw;
  height: 2vw;
  border-radius: 1rem;
  cursor: pointer;
`;

export const ColorInput = styled.input`
  width: 4vw;
  height: 2.2vw;
  border-radius: 0.3rem;
  border: 1px solid #2a3b4f;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
`;
export const Primary = styled.button`
  background-color: #3b82f6;
  border: none;
  color: #000;
  font-weight: 700;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;
export const Secondary = styled.button`
  background-color: #0b121a;
  border: 1px solid #2a3b4f;
  color: #c7d2e1;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;
