import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "../../utils/interface/user-data";

export type AuthUser = Omit<UserData, "password">;

type AuthState = {
  user: AuthUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(currentState, action: PayloadAction<AuthUser>) {
      currentState.user = action.payload;
    },
    clearUser(currentState) {
      currentState.user = null;
    },
    loadSessionDone(currentState, action: PayloadAction<AuthUser | null>) {
      currentState.user = action.payload;
    },
  },
});

export const { setUser, clearUser, loadSessionDone } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
