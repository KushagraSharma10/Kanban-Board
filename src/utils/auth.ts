import { SESSION_STORAGE_KEY, USERS_STORAGE_KEY } from "./constants/auth";
import type { UserData } from "./interface/user-data";
import { loadFromStorage } from "./storage";

export function getActiveUser(): UserData | null {
  const session = loadFromStorage(SESSION_STORAGE_KEY, null);
  if (!session?.userId) {
    return null;
  }

  const allUsers = getAllUsers();
  const activeUser = allUsers.find((user) => user.id === session.userId);

  return activeUser || null;
}

export function getAllUsers(): UserData[] {
  const stored = loadFromStorage(USERS_STORAGE_KEY, []);
  return Array.isArray(stored) ? (stored as UserData[]) : [];
}
