import {
  HeaderContainer,
  HeaderLeft,
  HeaderRight,
  Logo,
  SearchInput,
} from "../../styles/dashboard/header";
import type { HeaderProp } from "../../utils/types/header";

const Header : React.FC<HeaderProp>= ({ setModalOpen, search, onSearchChange }: HeaderProp) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <Logo>
          <img src="./kanban.svg" alt="" />
          KanbanApp
        </Logo>
      </HeaderLeft>
      <HeaderRight>
        <SearchInput
          type="text"
          placeholder="Search boards..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />       
          <button onClick={() => setModalOpen(true)}>+ Create Board</button>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
