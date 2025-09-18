import { BsThreeDotsVertical } from "react-icons/bs";
import styled from "styled-components";

export const ThreeDots = styled(BsThreeDotsVertical)`
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

export const Card = styled.div`
  width: 20vw;
  border-radius: 1.5rem;
  background-color: #151d27;
  cursor: pointer;
  position: relative;

  &:hover ${ThreeDots} {
    opacity: 1;
  }

  @media (max-width: 1024px) {
    width: 30vw;
    min-height: 20vw;
  }

  @media (max-width: 768px) {
    width: 45vw;
    min-height: 30vw;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-height: 46vw;
  }
`;

export const ContentClip = styled.div`
  border-radius: inherit;
  overflow: hidden;
  background: inherit;
`;


export const ColorDiv = styled.div<{ $bg: string }>`
  width: 100%;
  height: 7vw;
  background-color: ${({ $bg }) => $bg};

  @media (max-width: 768px) {
    height: 15vw;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-height: 20vw;
  }
`;

export const BoardContent = styled.div`
  padding: 1.4rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    font-size: 0.9rem;
    margin-top: 0.2rem;
    color: #706e6e;
  }

  .details {
    padding: 0rem 0.2rem;
  }
`;

export const DotWrap = styled.div`
  position: relative;
`

export const OptionsMenu = styled.div`
  position: absolute;
  top: 9rem;
  right: 1rem;
  background: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 999;
  min-width: 6vw;
  display: flex;
  flex-direction: column;

  button {
    padding: 0.6rem 1rem;
    background: none;
    border: none;
    color: white;
    text-align: left;
    font-size: 0.9rem;
    cursor: pointer;

    &:hover {
      background-color: #374151;
    }
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 998;
`;
