import { useEffect, useState } from "react";
import BoardCard from "../components/dashboard/BoardCard";
import {
  Board as BoardWrapper,
  BoardArea,
  CreateBoard,
  Main,
  Cards,
  NoBoards,
  Query,
} from "../styles/dashboard/dashboard";
import CreateBoardModal from "../components/dashboard/CreateBoard";
import Header from "../components/dashboard/Header";
import type { BoardItem } from "../types/dashboard";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const BOARDS_STORAGE_KEY = "kanban.boards";
const SESSION_STORAGE_KEY = "kanban.session";

const Dashboard = () => {
  const navigate = useNavigate();

  const activeSession = getSession();
  const activeUserId = activeSession?.userId || null;

  const [boardList, setBoardList] = useState<BoardItem[]>([]);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [boardModalMode, setBoardModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedBoardForEdit, setSelectedBoardForEdit] =
    useState<BoardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeUserId) {
      navigate("/");
      return;
    }
    const userBoards = getBoardsForUser(activeUserId);
    setBoardList(userBoards);
  }, [activeUserId, navigate]);

  const handleCreateBoard = (boardData: {
    name: string;
    type: string;
    color: string;
  }) => {
    if (!activeUserId) return;

    const newName = boardData.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!newName) {
      alert("Please enter a board name.");
      return;
    }

    const isDup = getBoardsForUser(activeUserId).some(
      (board) =>
        board.name.trim().split(" ").filter(Boolean).join(" ").toLowerCase() ===
        newName
    );

    if (isDup) {
      alert("A board with this name already exists.");
      return;
    }

    const createdBoard = addBoardForUser(activeUserId, boardData);
    setBoardList((previousBoards) => [createdBoard, ...previousBoards]);
  };

  const handleUpdateBoard = (
    boardId: string,
    boardData: { name: string; type: string; color: string }
  ) => {
    if (!activeUserId) return;

    const newName = boardData.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!newName) {
      alert("Please enter a board name.");
      return;
    }

    const isDup = getBoardsForUser(activeUserId).some(
      (board) =>
        board.id !== boardId &&
        board.name.trim().split(" ").filter(Boolean).join(" ").toLowerCase() ===
          newName
    );

    if (isDup) {
      alert("A board with this name already exists.");
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

  type SessionDataLocal = { userId: string; createdAt: number };

  function getSession(): SessionDataLocal | null {
    const session = loadFromStorage(SESSION_STORAGE_KEY, null);
    return session ?? null;
  }

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

  function addBoardForUser(
    userId: string,
    data: { name: string; type: string; color: string }
  ): BoardItem {
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
    data: { name: string; type: string; color: string }
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

  function getAllBoards(): BoardItem[] {
    return loadFromStorage(BOARDS_STORAGE_KEY, []) as BoardItem[];
  }

  function saveAllBoards(boards: BoardItem[]) {
    saveToStorage(BOARDS_STORAGE_KEY, boards);
  }

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
