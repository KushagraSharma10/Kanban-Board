import { HeaderRight, HeaderContainer, HeaderLeft, Logo, Profile, SearchInput } from "../../styles/dashboard/header";
import type { HeaderProp } from "../../types/header";

export default function Header({ setModalOpen, search, onSearchChange  }: HeaderProp) {
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
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.JlqeUVLU3SK_9LI_Fxvs3wHaHa?r=0&w=1024&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="User"
          />
        </Profile>
      </HeaderRight>
    </HeaderContainer>
  );
}
