import {
  HeaderBottom,
  HeaderContainer,
  HeaderTop,
  Logo,
  Profile,
  SearchInput,
} from "../../styles/dashboard/header";
import type { HeaderProp } from "../../types/header";

const Header : React.FC<HeaderProp>= ({ setModalOpen, search, onSearchChange }: HeaderProp) => {
  return (
    <HeaderContainer>
      <HeaderTop>
        <Logo>
          <img src="./kanban.svg" alt="" />
          KanbanApp
        </Logo>
      </HeaderTop>
      <HeaderBottom>
        <SearchInput
          type="text"
          placeholder="Search boards..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Profile>
          <button onClick={() => setModalOpen(true)}>+ Create Board</button>
        </Profile>
      </HeaderBottom>
    </HeaderContainer>
  );
};

export default Header;
