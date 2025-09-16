import { useState } from "react";
import BoardCard from "../components/dashboard/BoardCard";
import {
  Board, BoardArea, CreateBoard, Header, Main, Sidebar, Cards,
} from "../styles/dashboard/dashboard";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";

export default function Dashboard() {
  const [boards, setBoards] = useState([
    { id: 1, name: "Api Development", type: "Engineering", color: "green" },
    { id: 2, name: "Frontend Revamp", type: "Design", color: "red" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateBoard = (data: { name: string; type: string; color: string }) => {
    setBoards((prev) => [{ id: Date.now(), ...data }, ...prev]);
  };

  return (
    <Main>
      <Header>header</Header>
      <Board>
        <Sidebar />
        <BoardArea>
          <h1>Marketing</h1>
          <Cards>
            {boards.map((board) => (
              <BoardCard key={board.id} name={board.name} type={board.type} color={board.color} />
            ))}
            <CreateBoard onClick={() => setModalOpen(true)}>+ Create Board</CreateBoard>
          </Cards>
        </BoardArea>
      </Board>

      <CreateBoardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateBoard}
      />
    </Main>
  );
}
