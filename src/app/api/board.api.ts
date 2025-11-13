import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type { BackendBoard } from "../../utils/types/board";
import type { BoardForm, BoardItem } from "../../utils/types/dashboard";
import type { Envelope } from "../../utils/interface/auth";
import { toBoardItem } from "../../utils/boards";

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:4000",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {

      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Boards"], 
  endpoints: (builder) => ({
    getBoards: builder.query<BoardItem[], void>({
      query: () => "/boards",
      transformResponse: (response: Envelope<BackendBoard[]>) => {
        const boards = Array.isArray(response) ? response : response.data;
        return boards.map(toBoardItem);
      },
      providesTags: ["Boards"], 
    }),

    createBoard: builder.mutation<BoardItem, BoardForm>({
      query: (newBoard) => ({
        url: "/boards",
        method: "POST",
        body: newBoard,
      }),
      transformResponse: (response: Envelope<BackendBoard>) => 
        toBoardItem(response.data as BackendBoard),
      invalidatesTags: ["Boards"],
    }),

    updateBoard: builder.mutation<BoardItem, { id: string; data: BoardForm }>({
      query: ({ id, data }) => ({
        url: `/boards/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: Envelope<BackendBoard>) => 
        toBoardItem(response.data as BackendBoard),
      invalidatesTags: ["Boards"],
    }),

    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boards"], 
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardApi;