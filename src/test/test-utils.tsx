import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router";
import columnsReducer from "../app/slices/column.slice";
import authReducer from "../app/slices/auth.slice";
import boardsReducer from "../app/slices/board.slice";
import cardsReducer from "../app/slices/card.slice";
import type { RootState } from "../app/store/store";

type RenderOptions = {
  route?: string;
  path?: string;
  preloadedState?: Partial<RootState>;
};

export function renderWithProviders(
  ui: React.ReactElement,
  { route = "/board/board-1", path = "/board/:id", preloadedState }: RenderOptions = {}
) {

 const rootReducer = combineReducers({
    auth: authReducer,
    boards: boardsReducer,
    columns: columnsReducer,
    cards: cardsReducer,
  });
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}
