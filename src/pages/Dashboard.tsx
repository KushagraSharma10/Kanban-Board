import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import BoardCard from "../components/dashboard/BoardCard";
import {
  Board as BoardWrap,
  BoardArea,
  CreateBoard,
  Main,
  Cards,
} from "../styles/dashboard/dashboard";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";
import Header from "../components/dashboard/Header";
import type { BoardItem } from "../types/auth";
import { loadBoards, saveBoards } from "../utils/local-storage";

export default function Dashboard() {
  const [boards, setBoards] = useState<BoardItem[]>(() => loadBoards());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBoard, setSelectedBoard] = useState<BoardItem | null>(null);

  useEffect(() => {
    saveBoards(boards);
  }, [boards]);

  const handleCreateBoard = (data: {
    name: string;
    type: string;
    color: string;
  }) => {
    setBoards((prev) => [{ id: nanoid(), ...data }, ...prev]);
  };

  const handleUpdateBoard = (
    id: string,
    data: { name: string; type: string; color: string }
  ) => {
    setBoards((prev) =>
      prev.map((board) => (board.id === id ? { ...board, ...data } : board))
    );
  };

  const handleDeleteBoard = (id: string) => {
    setBoards((prev) => prev.filter((board) => board.id !== id));
  };

  return (
    <Main>
      <Header
        setModalOpen={(open: boolean) => {
          setModalMode("create");
          setSelectedBoard(null);
          setModalOpen(open);
        }}
      />

      <BoardWrap>
        <BoardArea>
          <h1>All Boards</h1>
          {boards.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#9aa4af",
                fontSize: "1.1rem",
              }}
            >
              No boards right now. Create one to get started!
            </div>
          ) : (
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
          )}
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
