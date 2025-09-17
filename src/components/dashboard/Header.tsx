import { CreateButton, HeaderBottom, HeaderContainer, HeaderTop, Logo, Profile, SearchInput, UserAvatar } from "../../styles/dashboard/header";

 type Props = {
  setModalOpen: (open: boolean) => void;
};


export default function Header({ setModalOpen }: Props) {
  return (
    <HeaderContainer>
        <HeaderTop>
        <Logo>
        <img src="./kanban.svg" alt="" width={30} />
        KanbanApp
        </Logo>
        </HeaderTop>
        <HeaderBottom>
      <SearchInput type="text" placeholder="Search boards..." />
      <Profile>
      <CreateButton  onClick={() => setModalOpen(true)}>+ Create</CreateButton>
      <UserAvatar src="https://tse3.mm.bing.net/th/id/OIP.JlqeUVLU3SK_9LI_Fxvs3wHaHa?r=0&w=1024&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3" alt="User" />
      </Profile>
        </HeaderBottom>
    </HeaderContainer>
  );
}
