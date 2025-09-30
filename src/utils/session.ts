import type { SessionData } from "react-router";
import { SESSION_STORAGE_KEY } from "./constants/auth";
import { loadFromStorage } from "./storage";

export function getSession(): SessionData | null {
  const session = loadFromStorage(SESSION_STORAGE_KEY, null);
  return session ?? null;
}
