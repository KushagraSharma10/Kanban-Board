import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import BoardCard from "../components/dashboard/BoardCard";
import {
  Board as BoardWrap,
  BoardArea,
  CreateBoard,
  Main,
  Cards,
  NoBoards,
  Query,
} from "../styles/dashboard/dashboard";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";
import Header from "../components/dashboard/Header";
import type { BoardItem } from "../types/dashboard";
import { getAllBoards, saveAllBoards } from "../services/boards";
import { useNavigate } from "react-router";

const Dashboard = () => {

  const navigate = useNavigate();

  const [boards, setBoards] = useState<BoardItem[]>(() => getAllBoards());

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBoard, setSelectedBoard] = useState<BoardItem | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveAllBoards(boards);
  }, [boards]);

  const handleCardAction = (
  action: "edit" | "delete",
  board: BoardItem
) => {
  if (action === "edit") {
    setSelectedBoard(board);
    setModalMode("edit");
    setModalOpen(true);
  } else if (action === "delete") {
    setBoards(prev => prev.filter(board => board.id !== board.id));
  }
};

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

  const filteredBoards = boards.filter(
    (board) =>
      board.name.toLowerCase().includes(search.toLowerCase()) ||
      board.type.toLowerCase().includes(search.toLowerCase())
  );

  function getAllBoards(): BoardItem[] {
    return loadFromStorage(BOARDS_STORAGE_KEY, []) as BoardItem[];
  }

  function saveAllBoards(boards: BoardItem[]) {
    saveToStorage(BOARDS_STORAGE_KEY, boards);
  }

  return (
    <Main>
      <Header
        setModalOpen={(open: boolean) => {
          setModalMode("create");
          setSelectedBoard(null);
          setModalOpen(open);
        }}
        search={search}
        onSearchChange={setSearch}
      />

      <BoardWrap>
        <BoardArea>
          <h1>My Boards</h1>
          {boards.length === 0 ? (
            <NoBoards>No boards right now. Create one to get started!</NoBoards>
          ) : filteredBoards.length === 0 ? (
            <NoBoards>
              No results for "<Query>{search}</Query>"
            </NoBoards>
          ) : (
            <Cards>
              {filteredBoards.map((board) => (
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
                  onOpen={() => navigate("/board")}
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
};

export default Dashboard;
