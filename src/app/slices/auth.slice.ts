import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../utils/types/auth";
import type { AuthStateWithToken } from "../../utils/interface/auth";

const initialState: AuthStateWithToken = { user: null, accessToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
    },
    restoreAuthState(
      state,
      action: PayloadAction<{
        user: AuthUser | null;
        accessToken: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { setAuth, setAccessToken, clearAuth, restoreAuthState } =
  authSlice.actions;
export default authSlice.reducer;

export const selectAuthUser = (state: { auth: AuthStateWithToken }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthStateWithToken }) => state.auth.accessToken;
