import { loadFromStorage, saveToStorage } from "../utils/storage";
import { getAllUsers } from "./auth";
import type { UserData } from "../interface/user-data";

const SESSION_STORAGE_KEY = "kanban.session";

export type SessionData = {
  userId: string;
  createdAt: number;
};

export function createSession(userId: string): void {
  const sessionData: SessionData = { userId, createdAt: Date.now() };
  saveToStorage(SESSION_STORAGE_KEY, sessionData);
}

export function getSession(): SessionData | null {
  const stored = loadFromStorage(SESSION_STORAGE_KEY, null);
  return stored ?? null;
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
        console.log(err)
  }
}

export function getCurrentUser(): UserData | null {
  const session = getSession();
  if (!session?.userId) return null;
  const allUsers = getAllUsers();
  return allUsers.find((user) => user.id === session.userId) ?? null;
}
