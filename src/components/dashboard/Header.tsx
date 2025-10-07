import { HeaderRight, HeaderContainer, HeaderLeft, Logo, Profile, SearchInput } from "../../styles/dashboard/header";
import type { HeaderProp } from "../../utils/types/header";

const Header:React.FC<HeaderProp> = ({ setModalOpen, search, onSearchChange  }: HeaderProp) => {
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
        <Profile>
          <button onClick={() => setModalOpen(true)}>
            + Create
          </button>
        </Profile>
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;
