import { useEffect, useState } from "react";
import BoardCard from "../components/dashboard/BoardCard";
import {
  Board as BoardWrapper,
  BoardArea,
  CreateBoard as CreateBoardDiv,
  Main,
  Cards,
  NoBoards,
  SearchQuery,
} from "../styles/dashboard/dashboard";
import CreateBoard from "../components/dashboard/CreateBoard";
import Header from "../components/dashboard/Header";
import type { BoardForm, BoardItem } from "../utils/types/dashboard";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";
import { getSession } from "../utils/session";
import {
  getAllBoards,
  getBoardsForUser,
  saveAllBoards,
  validateBoardName,
} from "../utils/boards";
import LoginPrompt from "../components/LoginPrompt";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const activeSession = getSession();
  const activeUserId = activeSession?.userId || null;

  const [boardList, setBoardList] = useState<BoardItem[]>([]);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const [boardModalMode, setBoardModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedBoardForEdit, setSelectedBoardForEdit] =
    useState<BoardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showLogin, setShowLogin] = useState<boolean>(false);

  useEffect(() => {
    if (!activeUserId) {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const userBoards = getBoardsForUser(activeUserId);
      setBoardList(userBoards);
    }
  }, [activeUserId]);

  const handleCreateBoard = (boardData: BoardForm) => {
    if (!activeUserId) return;

    const newName = validateBoardName(activeUserId, boardData);
    if (!newName) return;

    const createdBoard = addBoard(activeUserId, boardData);
    setBoardList((previousBoards) => [createdBoard, ...previousBoards]);
  };

  const handleUpdateBoard = (boardId: string, boardData: BoardForm) => {
    if (!activeUserId) return;

    const newName = validateBoardName(activeUserId, boardData, boardId);
    if (!newName) return;

    updateBoard(activeUserId, boardId, { ...boardData, name: newName });
    setBoardList((previousBoards) =>
      previousBoards.map((existingBoard) =>
        existingBoard.id === boardId
          ? { ...existingBoard, ...boardData, name: newName }
          : existingBoard
      )
    );
  };

  const handleDeleteBoard = (boardId: string) => {
    if (!activeUserId) return;
    deleteBoard(activeUserId, boardId);
    setBoardList((previousBoards) =>
      previousBoards.filter((existingBoard) => existingBoard.id !== boardId)
    );
  };

  const handleHeaderModalOpen = (isOpen: boolean) => {
    setBoardModalMode("create");
    setSelectedBoardForEdit(null);
    setIsBoardModalOpen(isOpen);
  };

  const handleEditBoard = (board: BoardItem) => {
    setSelectedBoardForEdit(board);
    setBoardModalMode("edit");
    setIsBoardModalOpen(true);
  };

  const addBoard = (userId: string, data: BoardForm): BoardItem => {
    const allBoards = getAllBoards();
    const newBoard: BoardItem = {
      id: nanoid(),
      userId,
      name: data.name.trim(),
      type: data.type.trim(),
      color: data.color,
    };
    saveAllBoards([newBoard, ...allBoards]);
    return newBoard;
  };

  const updateBoard = (
    userId: string,
    boardId: string,
    data: BoardForm
  ): void => {
    const allBoards = getAllBoards();
    const updatedBoards = allBoards.map((board) =>
      board.id === boardId && board.userId === userId
        ? { ...board, ...data }
        : board
    );
    saveAllBoards(updatedBoards);
  };

  const deleteBoard = (userId: string, boardId: string): void => {
    const allBoards = getAllBoards();
    const remainingBoards = allBoards.filter(
      (board) => !(board.id === boardId && board.userId === userId)
    );
    saveAllBoards(remainingBoards);
  };

  const filteredBoards = boardList.filter(
    (board) =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedBoardForEdit(null);
    setBoardModalMode("create");
    setIsBoardModalOpen(true);
  };

  return (
    <Main>
      <Header
        setModalOpen={handleHeaderModalOpen}
        search={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <BoardWrapper>
        <BoardArea>
          <h1>My Boards</h1>
          {!boardList.length ? (
            <NoBoards>No boards right now. Create one to get started!</NoBoards>
          ) : !filteredBoards.length ? (
            <NoBoards>
              No results for "<SearchQuery>{searchQuery}</SearchQuery>"
            </NoBoards>
          ) : (
            <Cards>
              {filteredBoards.map((board: BoardItem) => (
                <BoardCard
                  key={board.id}
                  name={board.name}
                  type={board.type}
                  color={board.color}
                  onEdit={() => handleEditBoard(board)}
                  onOpen={() => navigate(`/board/${board.id}`)}
                  onDelete={() => handleDeleteBoard(board.id)}
                />
              ))}

              <CreateBoardDiv onClick={handleCreate}>
                + Create Board
              </CreateBoardDiv>
            </Cards>
          )}
        </BoardArea>
      </BoardWrapper>

      <CreateBoard
        open={isBoardModalOpen}
        mode={boardModalMode}
        board={selectedBoardForEdit ?? undefined}
        onClose={() => setIsBoardModalOpen(false)}
        onCreate={handleCreateBoard}
        onUpdate={handleUpdateBoard}
      />

      <LoginPrompt isOpen={showLogin} onLoginClick={() => navigate("/login")} />
    </Main>
  );
};

export default Dashboard;
