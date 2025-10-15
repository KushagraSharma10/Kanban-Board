import React from "react";
import { screen, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import Card from "../Card";
import { cloneCardInColumn } from "../../../app/thunks/card.thunks";
import type { CardData } from "../../../utils/interface/card";

jest.mock("../../../app/thunks/card.thunks", () => ({
  cloneCardInColumn: jest.fn((columnId: string, cardId: string) => ({
    type: "CLONE_CARD",
    payload: { columnId, cardId },
  })),
}));

jest.mock("../CreateCard", () => {
  const MockModal = (props: {
    card: CardData;
    onSave: (updatedCard: CardData) => void;
    onClose: () => void;
  }) => (
    <div data-testid="card-modal">
      <div>Edit Card Modal</div>
      <button onClick={() => props.onSave({ ...props.card, title: "Edited" })}>
        Save Mock
      </button>
      <button onClick={props.onClose}>Close Mock</button>
    </div>
  );
  return { __esModule: true, default: MockModal };
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

const renderWithStore = (ui: React.ReactElement) =>{
  const store = configureStore({
    reducer: combineReducers({
      dummy: (state = {}) => state,
    }),
  });

  return { ...render(<Provider store={store}>{ui}</Provider>), store };
}

const longText = "x".repeat(500);

const baseCard: CardData = {
  id: "card-1",
  boardId: "board-1",
  columnId: "col-1",
  title: "Initial Title",
  description: longText,
  dueDate: "2099-12-31",
  label: "high",
  assignees: [
    "alice@example.com",
    "bob@example.com",
    "charlie@example.com",
    "dave@example.com",
  ],
};

describe("Card component (simple flow tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title, label, truncated description, due date and assignees (+n)", () => {
    renderWithStore(
      <Card card={baseCard} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByText("Initial Title")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText(/Due: 2099-12-31/i)).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.endsWith("..."))
    ).toBeInTheDocument();

    expect(screen.getByTitle("alice@example.com")).toBeInTheDocument();
    expect(screen.getByTitle("bob@example.com")).toBeInTheDocument();
    expect(screen.getByTitle("charlie@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("opens edit modal and triggers onUpdate after save", async () => {
    const user = userEvent.setup();
    const onUpdate = jest.fn();

    renderWithStore(
      <Card card={baseCard} onUpdate={onUpdate} onDelete={jest.fn()} />
    );

    await user.click(screen.getByLabelText(/edit card/i));
    expect(screen.getByTestId("card-modal")).toBeInTheDocument();

    await user.click(screen.getByText(/save mock/i));
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Edited" })
    );
  });

  it("toggles options menu and closes on outside click", async () => {
    const user = userEvent.setup();

    renderWithStore(
      <Card card={baseCard} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );

    await user.click(screen.getByLabelText(/card options/i));
    expect(screen.getByText(/clone card/i)).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText(/clone card/i)).not.toBeInTheDocument();
  });

  it("clones the card when 'Clone Card' is clicked", async () => {
    const user = userEvent.setup();

    renderWithStore(
      <Card card={baseCard} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );

    await user.click(screen.getByLabelText(/card options/i));
    await user.click(screen.getByText(/clone card/i));

    expect(cloneCardInColumn).toHaveBeenCalledWith("col-1", "card-1");
  });

  it("deletes the card after confirming in delete modal", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    renderWithStore(
      <Card card={baseCard} onUpdate={jest.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByLabelText(/card options/i));
    await user.click(screen.getByText(/delete/i));

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    await user.click(screen.getByText(/confirm/i));

    expect(onDelete).toHaveBeenCalledWith("card-1");
  });

  it("does not render label badge when label is 'none'", () => {
    const noLabelCard: CardData = { ...baseCard, label: "none" };
    renderWithStore(
      <Card card={noLabelCard} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.queryByText("HIGH")).not.toBeInTheDocument();
  });
});
