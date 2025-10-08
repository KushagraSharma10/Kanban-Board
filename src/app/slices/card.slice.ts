import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { CardData } from "../../utils/interface/card";
import type { CardsState } from "../../utils/types/card";

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
      const otherColumnCards = state.items.filter(
        (card) => card.columnId !== columnId
      );
      state.items = [...otherColumnCards, ...cards];
    },
  },
});

export const { setCardsForColumn } = cardsSlice.actions;
export default cardsSlice.reducer;

export const selectCardsForColumn = (
  state: RootState,
  columnId: string
): CardData[] => state.cards.items.filter((card) => card.columnId === columnId);
