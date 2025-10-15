import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoardView from "../BoardView";
import { makeDataTransfer, renderWithProviders } from "../../test/test-utils";
import {
  SeedColumnsForBoard,
  createColumn,
  applyColumnOrder,
  loadColumnsForBoard,
} from "../../app/thunks/columns.thunks";
import { readAllBoards } from "../../app/thunks/board.thunks";
import type { StoredColumn } from "../../utils/types/column";

const navigateMock = jest.fn();

jest.mock("react-router", () => {
  const actual = jest.requireActual("react-router");
  return {
    ...actual,
    useParams: () => ({ id: "board-1" }),
    useNavigate: () => navigateMock,
  };
});

jest.mock("../../utils/session", () => ({
  getSession: () => ({ userId: "u1" }),
}));

jest.mock("../../app/thunks/board.thunks", () => ({
  readAllBoards: jest.fn(() => [
    { id: "board-1", userId: "u1", name: "My Test Board" },
  ]),
}));

jest.mock("../../app/thunks/columns.thunks", () => ({
  SeedColumnsForBoard: jest.fn((boardId: string) => ({
    type: "SEED",
    payload: boardId,
  })),
  createColumn: jest.fn((boardId: string, title: string) => ({
    type: "CREATE_COLUMN",
    payload: { boardId, title },
  })),
  renameColumnThunk: jest.fn(),
  deleteColumnThunk: jest.fn(),
  applyColumnOrder: jest.fn(
    (boardId: string, cols: Array<{ id: string; title: string }>) => ({
      type: "APPLY_COLUMN_ORDER",
      payload: { boardId, cols },
    })
  ),
  loadColumnsForBoard: jest.fn(() => []),
}));

jest.mock("../../components/column/Column", () => {
  const MockColumn = (props: { title: string }) => (
    <div data-testid="column">{props.title}</div>
  );
  return { __esModule: true, default: MockColumn };
});

describe("BoardView — Complete Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadColumnsForBoard as jest.Mock).mockReturnValue([]);
  });

  it("renders board name and seeds columns", async () => {
    renderWithProviders(<BoardView />);
    expect(await screen.findByText("My Test Board")).toBeInTheDocument();
    expect(SeedColumnsForBoard).toHaveBeenCalledWith("board-1");
  });

  it("shows Add Column input when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BoardView />);
    await user.click(screen.getByTitle(/add column/i));
    expect(screen.getByPlaceholderText(/column name/i)).toBeInTheDocument();
  });

  it("updates search input when user types", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BoardView />);
    const searchInput = screen.getByPlaceholderText(/search cards/i);
    await user.type(searchInput, "task");
    expect(searchInput).toHaveValue("task");
  });

  it("creates new column when valid name entered", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BoardView />);
    await user.click(screen.getByTitle(/add column/i));
    const input = screen.getByPlaceholderText(/column name/i);
    await user.type(input, "To Review");
    await user.click(screen.getByText(/^add$/i));
    expect(createColumn).toHaveBeenCalledWith("board-1", "To Review");
  });

  it("prevents creating column with empty name (Add disabled)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BoardView />);
    await user.click(screen.getByTitle(/add column/i));
    const input = screen.getByPlaceholderText(/column name/i);
    await user.type(input, "   ");
    const addBtn = screen.getByText(/^add$/i);
    expect(addBtn).toBeDisabled();
    expect(createColumn).not.toHaveBeenCalled();
  });

  it("closes Add Column input when ✕ clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BoardView />);
    await user.click(screen.getByTitle(/add column/i));
    expect(screen.getByPlaceholderText(/column name/i)).toBeInTheDocument();
    await user.click(screen.getByTitle(/close/i));
    expect(
      screen.queryByPlaceholderText(/column name/i)
    ).not.toBeInTheDocument();
  });

  it("focuses input automatically when Add Column opens", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BoardView />);
    await user.click(screen.getByTitle(/add column/i));
    const input = screen.getByPlaceholderText(/column name/i);
    expect(input).toHaveFocus();
  });

  it("redirects to login page when board not found", async () => {
    (readAllBoards as jest.Mock).mockReturnValueOnce([]);
    renderWithProviders(<BoardView />);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("seeds columns only if empty", async () => {
    const preloadedState = {
      columns: {
        items: [
          {
            id: "c1",
            boardId: "board-1",
            title: "To Do",
            createdAt: Date.now(),
          } as StoredColumn,
        ],
      },
    };
    renderWithProviders(<BoardView />, { preloadedState });
    await waitFor(() => {
      expect(SeedColumnsForBoard).not.toHaveBeenCalled();
    });
  });

  it("calls applyColumnOrder on column drop", async () => {
    const now = Date.now();
    const storedColumns: StoredColumn[] = [
      { id: "col-1", title: "To Do", boardId: "board-1", createdAt: now },
      { id: "col-2", title: "In Progress", boardId: "board-1", createdAt: now },
    ];
    const preloadedState = { columns: { items: storedColumns } };
    renderWithProviders(<BoardView />, { preloadedState });

    const wrappers = screen.getAllByTitle(/drag to reorder/i);
    const dataTransfer = makeDataTransfer();

    fireEvent.dragStart(wrappers[0], { dataTransfer });
    fireEvent.dragOver(wrappers[1], { dataTransfer });
    fireEvent.drop(wrappers[1], { dataTransfer });

    await waitFor(() => {
      expect(applyColumnOrder).toHaveBeenCalledWith(
        "board-1",
        expect.any(Array)
      );
    });
  });
});
