import { useState } from "react";
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
import { 
  useGetBoardsQuery, 
  useCreateBoardMutation, 
  useUpdateBoardMutation, 
  useDeleteBoardMutation 
} from "../app/api/board.api";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/api-error";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: boardsList = [], isLoading } = useGetBoardsQuery();

  const [createBoard] = useCreateBoardMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();

  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const [boardModalMode, setBoardModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedBoardForEdit, setSelectedBoardForEdit] =
    useState<BoardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCreateBoard = async (boardData: BoardForm) => {
    try {
      await createBoard(boardData).unwrap(); 
      toast.success("Board created successfully!");
      setIsBoardModalOpen(false); 
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateBoard = async (boardId: string, boardData: BoardForm) => {
    try {
      await updateBoard({ id: boardId, data: boardData }).unwrap();
      toast.success("Board updated successfully!");
      setIsBoardModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    
    try {
      await deleteBoard(boardId).unwrap();
      toast.success("Board deleted successfully!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
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


  if (isLoading) {
    return (
      <Main>
        <div className="flex flex-col items-center justify-center h-[80vh] w-full">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-[#6ca0ff] rounded-full animate-spin mb-4" />
          
          <p className="text-white text-lg font-medium animate-pulse">
            Loading your boards...
          </p>
        </div>
      </Main>
    );
  }

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
