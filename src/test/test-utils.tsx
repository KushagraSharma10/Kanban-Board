import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router";
import columnsReducer from "../app/slices/column.slice";
import type { RootState } from "../app/store/store";
import type { RenderOptions } from "../utils/types/board";


export const renderWithProviders = (
  component: React.ReactElement,
  {
    route = "/board/board-1",
    path = "/board/:id",
    preloadedState,
  }: RenderOptions = {}
) => {
  const rootReducer = combineReducers({ columns: columnsReducer });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={component} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

export const makeDataTransfer = (): DataTransfer => {
  const store: Record<string, string> = {};
  return {
    setData: (type: string, value: string) => {
      store[type] = value;
    },
    getData: (type: string) => store[type] || "",
    clearData: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    setDragImage: () => {},
    effectAllowed: "all",
    dropEffect: "move",
    files: {} as FileList,
    items: {} as DataTransferItemList,
    types: [],
  } as DataTransfer;
};
