import { useEffect, useState } from "react";
import BoardCard from "../components/dashboard/BoardCard";
import {
  Board as BoardWrapper, BoardArea, CreateBoard, Main, Cards,
  NoBoards, Query,
} from "../styles/dashboard/dashboard";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";
import Header from "../components/dashboard/Header";
import type { BoardItem } from "../types/dashboard";
import {
  getBoardsForUser,
  addBoardForUser,
  updateBoardForUser,
  deleteBoardForUser,
} from "../services/boards";
import { getSession } from "../services/session";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();

  const activeSession = getSession();
  const activeUserId = activeSession?.userId || null;

  const [boardList, setBoardList] = useState<BoardItem[]>([]);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [boardModalMode, setBoardModalMode] = useState<"create" | "edit">("create");
  const [selectedBoardForEdit, setSelectedBoardForEdit] = useState<BoardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeUserId) {
      navigate("/");
      return;
    }
    const userBoards = getBoardsForUser(activeUserId);
    setBoardList(userBoards);
  }, [activeUserId, navigate]);

  const handleCreateBoard = (boardData: { name: string; type: string; color: string }) => {
    if (!activeUserId) return;
    const createdBoard = addBoardForUser(activeUserId, boardData);
    setBoardList((previousBoards) => [createdBoard, ...previousBoards]);
  };

  const handleUpdateBoard = (
    boardId: string,
    boardData: { name: string; type: string; color: string }
  ) => {
    if (!activeUserId) return;
    updateBoardForUser(activeUserId, boardId, boardData);
    setBoardList((previousBoards) =>
      previousBoards.map((existingBoard) =>
        existingBoard.id === boardId ? { ...existingBoard, ...boardData } : existingBoard
      )
    );
  };

  const handleDeleteBoard = (boardId: string) => {
    if (!activeUserId) return;
    deleteBoardForUser(activeUserId, boardId);
    setBoardList((previousBoards) =>
      previousBoards.filter((existingBoard) => existingBoard.id !== boardId)
    );
  };

  const filteredBoards = boardList.filter(
    (board) =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Main>
      <Header
        setModalOpen={(isOpen: boolean) => {
          setBoardModalMode("create");
          setSelectedBoardForEdit(null);
          setIsBoardModalOpen(isOpen);
        }}
        search={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <BoardWrapper>
        <BoardArea>
          <h1>My Boards</h1>

          {boardList.length === 0 ? (
            <NoBoards>No boards right now. Create one to get started!</NoBoards>
          ) : filteredBoards.length === 0 ? (
            <NoBoards>
              No results for "<Query>{searchQuery}</Query>"
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
                    setSelectedBoardForEdit(board);
                    setBoardModalMode("edit");
                    setIsBoardModalOpen(true);
                  }}
                  onOpen={() => navigate(`/board/${board.id}`)} 
                  onDelete={() => handleDeleteBoard(board.id)}
                />
              ))}

              <CreateBoard
                onClick={() => {
                  setSelectedBoardForEdit(null);
                  setBoardModalMode("create");
                  setIsBoardModalOpen(true);
                }}
              >
                + Create Board
              </CreateBoard>
            </Cards>
          )}
        </BoardArea>
      </BoardWrapper>

      <CreateBoardModal
        open={isBoardModalOpen}
        mode={boardModalMode}
        board={selectedBoardForEdit ?? undefined}
        onClose={() => setIsBoardModalOpen(false)}
        onCreate={handleCreateBoard}
        onUpdate={handleUpdateBoard}
      />
    </Main>
  );
};

export default Dashboard;
