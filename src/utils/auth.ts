import { USERS_STORAGE_KEY } from "./constants/auth";
import type { UserData } from "./interface/user-data";
import { getSession } from "./session";
import { loadFromStorage } from "./storage";

export const getActiveUser = (): UserData | null => {
  const session = getSession();
  if (!session?.userId) {
    return null;
  }
  const allUsers = getAllUsers();
  const activeUser = allUsers.find((user) => user.id === session.userId);

  return activeUser || null;
};

export const getAllUsers = (): UserData[] => {
  const stored = loadFromStorage(USERS_STORAGE_KEY, []);
  return Array.isArray(stored) ? (stored as UserData[]) : [];
};
