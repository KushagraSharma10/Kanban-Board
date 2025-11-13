import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router";
import columnsReducer from "../app/slices/column.slice";
import authReducer from "../app/slices/auth.slice";
import cardsReducer from "../app/slices/card.slice";
import { boardApi } from "../app/api/board.api";
import type { RenderOptions } from "../utils/types/test";



export const renderWithProviders = (
  ui: React.ReactElement,
  { route = "/board/board-1", path = "/board/:id", preloadedState }: RenderOptions = {}
) => {

 const rootReducer = combineReducers({
    auth: authReducer,
    [boardApi.reducerPath]: boardApi.reducer,
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
};
