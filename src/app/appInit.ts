import { setAccessTokenHeader } from "../lib/apiClient";
import type { AuthStateWithToken } from "../utils/interface/auth";
import { restoreAuthState } from "./slices/auth.slice";
import { store } from "./store/store";

export const initializeAuth = (): void => {
  try {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const parsed: AuthStateWithToken = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && 'accessToken' in parsed && 'user' in parsed) {
        store.dispatch(restoreAuthState(parsed));
        setAccessTokenHeader(parsed.accessToken);
      } else {
        throw new Error('Invalid auth data structure');
      }
    }
  } catch (error) {
    console.error("Failed to initialize auth from localStorage:", error);
    localStorage.removeItem("auth");
  }

  store.subscribe(() => {
    const { user, accessToken } = store.getState().auth;
    const data: AuthStateWithToken = { user, accessToken };
    localStorage.setItem("auth", JSON.stringify(data));
  });
};
