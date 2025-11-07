import { setAccessTokenHeader } from "../lib/apiClient";
import type { AuthStateWithToken } from "../utils/interface/auth";
import { hydrateAuth } from "./slices/auth.slice";
import { store } from "./store/store";

export const initializeAuth = (): void =>{
  const saved = localStorage.getItem("auth");
  if (saved) {
    const parsed: AuthStateWithToken = JSON.parse(saved);
    store.dispatch(hydrateAuth(parsed));
    setAccessTokenHeader(parsed.accessToken);
  }

  store.subscribe(() => {
    const { user, accessToken } = store.getState().auth;
    const data: AuthStateWithToken = { user, accessToken };
    localStorage.setItem("auth", JSON.stringify(data));
  });   
}
