import React from "react";
import { screen, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import Column from "../Column";
import columnsReducer from "../../../app/slices/column.slice";
import cardsReducer from "../../../app/slices/card.slice";
import type { StoredColumn } from "../../../utils/types/column";
import type { CardData } from "../../../utils/interface/card";

import {
  loadCardsForColumn,
  addCardToColumn,
} from "../../../app/thunks/card.thunks";

const openColumnMenu = (): void => {
  const titleEl = screen.getByTitle(/double-click to rename/i); 
  const headerDiv = titleEl.parentElement as HTMLElement;
  const svgToggle = headerDiv.querySelector("svg") as SVGElement;
  fireEvent.click(svgToggle);
};

jest.mock("../../../app/thunks/card.thunks", () => ({
  loadCardsForColumn: jest.fn((columnId: string) => ({
    type: "LOAD_CARDS",
    payload: { columnId },
  })),
  addCardToColumn: jest.fn(
    (boardId: string, columnId: string, title: string) => ({
      type: "ADD_CARD",
      payload: { boardId, columnId, title },
    })
  ),
  updateCardInColumn: jest.fn((card: CardData) => ({
    type: "UPDATE_CARD",
    payload: card,
  })),
  deleteCardFromColumn: jest.fn((columnId: string, cardId: string) => ({
    type: "DELETE_CARD",
    payload: { columnId, cardId },
  })),
}));

jest.mock("../../card/Card", () => {
  const MockCard = (props: { card: CardData }) => (
    <div data-testid="card">{props.card.title}</div>
  );
  return { __esModule: true, default: MockCard };
});

jest.mock("../../DeleteConfirmation", () => {
  const MockDelete = (props: {
    isOpen: boolean;
    itemName: string;
    onCancel: () => void;
    onConfirm: () => void;
  }) =>
    props.isOpen ? (
      <div data-testid="confirm-modal">
        <div>Delete {props.itemName}?</div>
        <button onClick={props.onConfirm}>Confirm</button>
        <button onClick={props.onCancel}>Cancel</button>
      </div>
    ) : null;
  return { __esModule: true, default: MockDelete };
});

const renderWithLocalStore = (
  ui: React.ReactElement,
  preloaded: {
    columns?: { items: StoredColumn[] };
    cards?: { items: CardData[] };
  } = {}
) => {
  const rootReducer = combineReducers({
    columns: columnsReducer,
    cards: cardsReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloaded,
  });

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

const now = Date.now();
const storedColumns: StoredColumn[] = [
  { id: "col-1", boardId: "board-1", title: "To Do", createdAt: now },
];

const baseCards: CardData[] = [
  { id: "a", boardId: "board-1", columnId: "col-1", title: "Alpha" },
  { id: "b", boardId: "board-1", columnId: "col-1", title: "Beta" },
];

const columnItem = { id: "col-1", title: "To Do" };

describe("Column component (simple flow tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads cards on mount", () => {
    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns } }
    );
    expect(loadCardsForColumn).toHaveBeenCalledWith("col-1");
  });

  it("renders column title", () => {
    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns } }
    );
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("rename: double-click → edit → Enter calls onRename", async () => {
    const user = userEvent.setup();
    const onRename = jest.fn();

    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={onRename}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns } }
    );

    await user.dblClick(screen.getByText("To Do"));
    const input = screen.getByPlaceholderText(/column name/i);
    await user.clear(input);
    await user.type(input, "In Review{enter}");

    expect(onRename).toHaveBeenCalledWith("col-1", "In Review");
  });

  it("cancel rename with Escape keeps original title", async () => {
    const user = userEvent.setup();
    const onRename = jest.fn();

    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={onRename}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns } }
    );

    await user.dblClick(screen.getByText("To Do"));
    const input = screen.getByPlaceholderText(/column name/i);
    await user.type(input, "Temp Name{escape}");

    expect(onRename).not.toHaveBeenCalled();
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("menu: Rename switches to editing", async () => {
    const user = userEvent.setup();

    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns } }
    );
    openColumnMenu();
    await user.click(screen.getByText("Rename"));

    expect(screen.getByPlaceholderText(/column name/i)).toBeInTheDocument();
  });

  it("menu: Delete opens confirm, and Confirm calls onDelete", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={onDelete}
      />,
      { columns: { items: storedColumns } }
    );

    openColumnMenu();
    await user.click(screen.getByText("Delete"));

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    await user.click(screen.getByText("Confirm"));

    expect(onDelete).toHaveBeenCalledWith("col-1");
  });

  it("add card: success path dispatches addCardToColumn", async () => {
    const user = userEvent.setup();

    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns }, cards: { items: [] } }
    );

    await user.click(screen.getByText(/add card/i));
    const input = screen.getByPlaceholderText(/card title/i);
    await user.type(input, "Task A");
    await user.click(screen.getByText(/^add$/i));

    expect(addCardToColumn).toHaveBeenCalledWith("board-1", "col-1", "Task A");
  });

  it("add card: empty title shows error and no dispatch", async () => {
    const user = userEvent.setup();

    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns }, cards: { items: [] } }
    );

    await user.click(screen.getByText(/add card/i));
    const input = screen.getByPlaceholderText(/card title/i);
    await user.type(input, "   ");
    await user.click(screen.getByText(/^add$/i));

    expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument();
    expect(addCardToColumn).not.toHaveBeenCalled();
  });

  it("add card: duplicate title shows error", async () => {
    const user = userEvent.setup();
    const cards: CardData[] = [
      { id: "1", boardId: "board-1", columnId: "col-1", title: "Task A" },
    ];

    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
      />,
      { columns: { items: storedColumns }, cards: { items: cards } }
    );

    await user.click(screen.getByText(/add card/i));
    const input = screen.getByPlaceholderText(/card title/i);
    await user.type(input, "task a");
    await user.click(screen.getByText(/^add$/i));

    expect(screen.getByText(/already exists/i)).toBeInTheDocument();
    expect(addCardToColumn).not.toHaveBeenCalled();
  });

  it("filtering: searchText filters visible cards by title", () => {
    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
        searchText="beta"
      />,
      {
        columns: { items: storedColumns },
        cards: { items: baseCards },
      }
    );

    const cards = screen.getAllByTestId("card").map((el) => el.textContent);
    expect(cards).toEqual(["Beta"]); 
  });

  it('filtering: shows "No matching cards" when none match', () => {
    renderWithLocalStore(
      <Column
        column={columnItem}
        boardId="board-1"
        onRename={jest.fn()}
        onDelete={jest.fn()}
        searchText="zzz"
      />,
      {
        columns: { items: storedColumns },
        cards: { items: baseCards },
      }
    );

    expect(screen.getByText(/no matching cards/i)).toBeInTheDocument();
  });
});
