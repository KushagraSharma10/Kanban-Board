import { useEffect, useState } from "react";
import BoardCard from "../components/board/BoardCard";
import {
  Board as BoardWrapper,
  BoardArea,
  CreateBoard as CreateBoardDiv,
  Main,
  Cards,
  NoBoards,
  SearchQuery,
} from "../styles/dashboard/dashboard";
import ManageBoard from "../components/board/ManageBoard";
import Header from "../components/board/Header";
import type { BoardForm, BoardItem } from "../utils/types/dashboard";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { selectBoards } from "../app/slices/board.slice";
import {
  createBoardForUser,
  deleteBoardForUser,
  loadBoardsForUser,
  updateBoardForUser,
} from "../app/thunks/board.thunks";
import { getActiveUserId } from "../utils/auth";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activeUserId = getActiveUserId();

  const boardsList = useAppSelector(selectBoards);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const [boardModalMode, setBoardModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedBoardForEdit, setSelectedBoardForEdit] =
    useState<BoardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    dispatch(loadBoardsForUser(activeUserId));
  }, [dispatch, activeUserId]);

  const handleCreateBoard = (boardData: BoardForm) => {
    dispatch(createBoardForUser(activeUserId, boardData));
  };

  const handleUpdateBoard = (boardId: string, boardData: BoardForm) => {
    dispatch(updateBoardForUser(activeUserId, boardId, boardData));
  };

  const handleDeleteBoard = (boardId: string) => {
    dispatch(deleteBoardForUser(activeUserId, boardId));
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

  const filteredBoards = boardsList.filter(
    (board) =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBoardClick = () => {
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

          {!boardsList.length ? (
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

              <CreateBoardDiv onClick={handleCreateBoardClick}>
                + Create Board
              </CreateBoardDiv>
            </Cards>
          )}
        </BoardArea>
      </BoardWrapper>

      <ManageBoard
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
