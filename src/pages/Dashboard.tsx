
import { useState } from "react";
import { nanoid } from "nanoid"; 
import BoardCard from "../components/dashboard/BoardCard";
import {
  Board as BoardWrap, BoardArea, CreateBoard, Main, Cards,
} from "../styles/dashboard/dashboard";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";
import Header from "../components/dashboard/Header";

type BoardItem = { id: string; name: string; type: string; color: string };

export default function Dashboard() {
  const [boards, setBoards] = useState<BoardItem[]>([
    { id: nanoid(), name: "Api Development", type: "Engineering", color: "green" },
    { id: nanoid(), name: "Frontend Revamp", type: "Design", color: "red" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBoard, setSelectedBoard] = useState<BoardItem | null>(null);

  const handleCreateBoard = (data: { name: string; type: string; color: string }) => {
    setBoards(prev => [{ id: nanoid(), ...data }, ...prev]);
  };

  const handleUpdateBoard = (id: string, data: { name: string; type: string; color: string }) => {
    setBoards(prev => prev.map(b => (b.id === id ? { ...b, ...data } : b)));
  };

  const handleDeleteBoard = (id: string) => {
    setBoards(prev => prev.filter(b => b.id !== id));
  };

  return (
    <Main>
      <Header setModalOpen={(open: boolean) => {
        setModalMode("create");
        setSelectedBoard(null);
        setModalOpen(open);
      }} />

      <BoardWrap>
        <BoardArea>
          <h1>All Boards</h1>
          <Cards>
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                name={board.name}
                type={board.type}
                color={board.color}
                onEdit={() => {
                  setSelectedBoard(board);
                  setModalMode("edit");
                  setModalOpen(true);
                }}
                onDelete={() => handleDeleteBoard(board.id)}
              />
            ))}

            <CreateBoard
              onClick={() => {
                setSelectedBoard(null);
                setModalMode("create");
                setModalOpen(true);
              }}
            >
              + Create Board
            </CreateBoard>
          </Cards>
        </BoardArea>
      </BoardWrap>

      <CreateBoardModal
        open={modalOpen}
        mode={modalMode}
        board={selectedBoard ?? undefined}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateBoard}
        onUpdate={handleUpdateBoard}
      />
    </Main>
  );
}
