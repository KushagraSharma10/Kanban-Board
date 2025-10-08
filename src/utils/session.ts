import { SESSION_STORAGE_KEY } from "./constants/session";
import { loadFromStorage } from "./storage";
import type { SessionData } from "./types/session";

 export function getSession(): SessionData | null {
    const session = loadFromStorage(SESSION_STORAGE_KEY, null);
    return session ?? null;
  }