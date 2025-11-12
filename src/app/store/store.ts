import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import columnsReducer from "../slices/column.slice";
import cardsReducer from "../slices/card.slice";
import { boardApi } from "../api/board.api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [boardApi.reducerPath]: boardApi.reducer,
    columns: columnsReducer,
    cards: cardsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(boardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
