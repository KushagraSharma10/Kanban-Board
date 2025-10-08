import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { AppDispatch, RootState } from "../../store/store";
import type { CardData } from "../../utils/interface/card";
import { loadCards, saveCards } from "../../utils/storage";
import { getNextCloneTitle } from "../../utils/getNextCloneTitle";

type CardsState = { items: CardData[] };

const initialState: CardsState = { items: [] };

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCardsForColumn(
      state,
      action: PayloadAction<{ columnId: string; cards: CardData[] }>
    ) {
      const { columnId, cards } = action.payload;
      const cardsFromOtherColumns = state.items.filter(
        (card) => card.columnId !== columnId
      );
      state.items = [...cardsFromOtherColumns, ...cards];
    },
  },
});

export const { setCardsForColumn } = cardsSlice.actions;
export default cardsSlice.reducer;

export const selectCardsForColumn = (
  state: RootState,
  columnId: string
): CardData[] => state.cards.items.filter((card) => card.columnId === columnId);

export const loadCardsForColumn =
  (columnId: string) =>
  (dispatch: AppDispatch): void => {
    const allCards = loadCards();
    const cardsForThisColumn = allCards.filter(
      (card) => card.columnId === columnId
    );
    dispatch(setCardsForColumn({ columnId, cards: cardsForThisColumn }));
  };

export const addCardToColumn =
  (boardId: string, columnId: string, rawTitle: string) =>
  (dispatch: AppDispatch): void => {
    const newCard: CardData = {
      id: nanoid(),
      title: rawTitle.trim(),
      boardId,
      columnId,
    };

    const allCards = loadCards();
    const updatedCards = [newCard, ...allCards];
    saveCards(updatedCards);

    const refreshedColumnCards = updatedCards.filter(
      (card) => card.columnId === columnId
    );
    dispatch(setCardsForColumn({ columnId, cards: refreshedColumnCards }));
  };

export const updateCardInColumn =
  (incomingCard: CardData) =>
  (dispatch: AppDispatch): void => {
    const allCards = loadCards();

    const normalizedTitle = incomingCard.title.trim();
    if (!normalizedTitle) {
      alert("Title cannot be empty.");
      return;
    }

    const cardsInSameColumn = allCards.filter(
      (card) => card.columnId === incomingCard.columnId
    );

    const isTitleDuplicate = cardsInSameColumn.some(
      (existingCard) =>
        existingCard.id !== incomingCard.id &&
        existingCard.title.trim().toLowerCase() ===
          normalizedTitle.toLowerCase()
    );
    if (isTitleDuplicate) {
      alert("A card with this title already exists in this column.");
      return;
    }

    const updatedCard: CardData = { ...incomingCard, title: normalizedTitle };
    const updatedCards = allCards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );
    saveCards(updatedCards);

    const refreshedColumnCards = updatedCards.filter(
      (card) => card.columnId === updatedCard.columnId
    );
    dispatch(
      setCardsForColumn({
        columnId: updatedCard.columnId,
        cards: refreshedColumnCards,
      })
    );
    alert("Card updated.");
  };

export const deleteCardFromColumn =
  (columnId: string, cardId: string) =>
  (dispatch: AppDispatch): void => {
    const remainingCards = loadCards().filter((card) => card.id !== cardId);
    saveCards(remainingCards);

    const refreshedColumnCards = remainingCards.filter(
      (card) => card.columnId === columnId
    );
    dispatch(setCardsForColumn({ columnId, cards: refreshedColumnCards }));
  };

export const cloneCardInColumn =
  (columnId: string, sourceCardId: string) =>
  (dispatch: AppDispatch): void => {
    const allCards = loadCards();

    const sourceIndex = allCards.findIndex(
      (card) => card.id === sourceCardId && card.columnId === columnId
    );
    if (sourceIndex === -1) return;

    const sourceCard = allCards[sourceIndex];

    const titlesInThisColumn = allCards
      .filter((card) => card.columnId === columnId)
      .map((card) => card.title);

    const clonedTitle = getNextCloneTitle(sourceCard.title, titlesInThisColumn);

    const clonedCard: CardData = {
      ...sourceCard,
      id: nanoid(),
      title: clonedTitle,
    };

    const updatedCards = [
      ...allCards.slice(0, sourceIndex + 1),
      clonedCard,
      ...allCards.slice(sourceIndex + 1),
    ];

    saveCards(updatedCards);

    const refreshedColumnCards = updatedCards.filter(
      (card) => card.columnId === columnId
    );
    dispatch(setCardsForColumn({ columnId, cards: refreshedColumnCards }));
  };
