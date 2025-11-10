import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "../../utils/types/auth";


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
    loadSessionDone(currentState, action: PayloadAction<AuthUser | null>) {
      currentState.user = action.payload;
    },
  },
});

export const { setUser, loadSessionDone } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
