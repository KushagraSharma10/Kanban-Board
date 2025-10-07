import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

import type { AppDispatch, RootState } from "../../store/store";
import type { CardData } from "../../utils/interface/card";
import { loadCards, saveCards } from "../../utils/storage";

type CardsState = {
  items: CardData[];
};

const initialState: CardsState = {
  items: [],
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCardsForColumn(
      currentState,
      action: PayloadAction<{ columnId: string; cards: CardData[] }>
    ) {
      const { columnId, cards } = action.payload;
      const others = currentState.items.filter(
        (card) => card.columnId !== columnId
      );
      currentState.items = [...others, ...cards];
    },
  },
});

export const { setCardsForColumn } = cardsSlice.actions;
export default cardsSlice.reducer;

export const selectCardsForColumn = (
  state: RootState,
  columnId: string
): CardData[] =>
  state.cards.items.filter((card) => card.columnId === columnId);

export const loadCardsForColumn =
  (columnId: string) =>
  (dispatch: AppDispatch): void => {
    const all = loadCards();
    const filtered = all.filter((card) => card.columnId === columnId);
    dispatch(setCardsForColumn({ columnId, cards: filtered }));
  };


export const addCardToColumn =
  (boardId: string, columnId: string, title: string) =>
  (dispatch: AppDispatch): void => {
    const newCard: CardData = {
      id: nanoid(),
      title: title.trim(),
      boardId,
      columnId,
    };
    const all = loadCards();
    const updatedAll = [newCard, ...all];
    saveCards(updatedAll);

    const reloaded = updatedAll.filter((card) => card.columnId === columnId);
    dispatch(setCardsForColumn({ columnId, cards: reloaded }));
  };

export const updateCardInColumn =
  (updatedCard: CardData) =>
  (dispatch: AppDispatch): void => {
    const all = loadCards();
    const replaced = all.map((card) => (card.id === updatedCard.id ? updatedCard : card));
    saveCards(replaced);

    const columnCards = replaced.filter(
      (card) => card.columnId === updatedCard.columnId
    );
    dispatch(
      setCardsForColumn({ columnId: updatedCard.columnId, cards: columnCards })
    );
  };

export const deleteCardFromColumn =
  (columnId: string, cardId: string) =>
  (dispatch: AppDispatch): void => {
    const remaining = loadCards().filter((card) => card.id !== cardId);
    saveCards(remaining);

    const columnCards = remaining.filter((c) => c.columnId === columnId);
    dispatch(setCardsForColumn({ columnId, cards: columnCards }));
  };
