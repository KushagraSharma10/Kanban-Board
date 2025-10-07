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
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { BOARDS_STORAGE_KEY } from "../utils/constants/board";
import { getSession } from "../utils/session";
import { normalizeBoardName } from "../utils/boards";
import { toast } from "react-toastify";


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

  useEffect(() => {
    if (!activeUserId) {
      navigate("/");
      return;
    }
    const userBoards = getBoardsForUser(activeUserId);
    setBoardList(userBoards);
  }, [activeUserId, navigate]);

  const handleCreateBoard = (boardData: BoardForm) => {
    if (!activeUserId) return;

    const newName = normalizeBoardName(boardData.name);

    if (!newName) {
      toast.error("Please enter a board name.");
      return;
    }

    const isDuplicate = getBoardsForUser(activeUserId).some(
      (board) => normalizeBoardName(board.name) === newName
    );

    if (isDuplicate) {
      toast.error("A board with this name already exists.");
      return;
    }

    const createdBoard = addBoardForUser(activeUserId, boardData);
    setBoardList((previousBoards) => [createdBoard, ...previousBoards]);
  };

  

  const handleUpdateBoard = (
    boardId: string,
    boardData: BoardForm
  ) => {
    if (!activeUserId) return;

    const newName = normalizeBoardName(boardData.name);

    if (!newName) {
      toast.error("Please enter a board name.");
      return;
    }

    const isDuplicate = getBoardsForUser(activeUserId).some(
      (board) =>
        board.id !== boardId && normalizeBoardName(board.name) === newName
    );

    if (isDuplicate) {
      toast.error("A board with this name already exists.");
      return;
    }

    updateBoardForUser(activeUserId, boardId, boardData);
    setBoardList((previousBoards) =>
      previousBoards.map((existingBoard) =>
        existingBoard.id === boardId
          ? { ...existingBoard, ...boardData }
          : existingBoard
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

  function getAllBoards(): BoardItem[] {
    const stored = loadFromStorage(BOARDS_STORAGE_KEY, []);
    return (Array.isArray(stored) ? stored : []) as BoardItem[];
  }

  function saveAllBoards(all: BoardItem[]) {
    saveToStorage(BOARDS_STORAGE_KEY, all);
  }

  function getBoardsForUser(userId: string): BoardItem[] {
    return getAllBoards().filter((board) => board.userId === userId);
  }

  function addBoardForUser(userId: string, data: BoardForm): BoardItem {
    const all = getAllBoards();
    const newBoard: BoardItem = {
      id: nanoid(),
      userId,
      name: data.name.trim(),
      type: data.type.trim(),
      color: data.color,
    };
    saveAllBoards([newBoard, ...all]);
    return newBoard;
  }

  function updateBoardForUser(
    userId: string,
    boardId: string,
    data: BoardForm
  ): void {
    const all = getAllBoards();
    const updated = all.map((board) =>
      board.id === boardId && board.userId === userId
        ? { ...board, ...data }
        : board
    );
    saveAllBoards(updated);
  }

  function deleteBoardForUser(userId: string, boardId: string): void {
    const all = getAllBoards();
    const remaining = all.filter(
      (board) => !(board.id === boardId && board.userId === userId)
    );
    saveAllBoards(remaining);
  }

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
    </Main>
  );
};

export default Dashboard;
