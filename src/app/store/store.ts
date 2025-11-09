import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import boardsReducer from "../slices/board.slice";
import columnsReducer from "../slices/column.slice";
import cardsReducer from "../slices/card.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    columns: columnsReducer,
    cards: cardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
