import {
  Content,
  ContentHeading,
  ContentSubText,
  Icon,
  PanelContainer,
} from "../../styles/auth/auth-sidebar";

const AuthSidebar = () => {
  return (
    <PanelContainer>
      <Icon viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </Icon>
      <Content>
        <ContentHeading>Streamline Your Workflow</ContentHeading>
        <ContentSubText>
          Collaborate, manage projects, and reach new productivity peaks. From
          high rises to the home office, the way your team works is
          unique—accomplish it all here.
        </ContentSubText>
      </Content>
    </PanelContainer>
  );
};

export default AuthSidebar;
