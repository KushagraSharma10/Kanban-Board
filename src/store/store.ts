import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth-slice";
import boardsReducer from "../features/boards/board-slice";
import columnsReducer from "../features/columns/column-slice";
import cardsReducer from "../features/cards/card-slice";

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
