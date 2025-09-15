import styled from "styled-components";

const LeftPanelDiv = styled.div`
  width: 100%;
  background-color: #181c24;
  padding: 2rem;
  color: #e6edf3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Icon = styled.svg`
  width: 50%;
  color: #3b82f6;
`;

const ContentHeading = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const Content = styled.div`
  text-align: center;
`;

const ContentSubText = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: #bdbdbd;
  margin-top: 0.8rem;
  line-height: 1.7rem;
`;

const LeftPanel = () => {
  return (
    <LeftPanelDiv>
      <Icon
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
      </Icon>
      <Content>
        <ContentHeading>Streamline Your Workflow</ContentHeading>
        <ContentSubText>
          Collaborate, manage projects, and reach new productivity peaks. From
          high rises to the home office, the way your team works is
          unique—accomplish it all here.
        </ContentSubText>
      </Content>
    </LeftPanelDiv>
  );
};

export default LeftPanel;
