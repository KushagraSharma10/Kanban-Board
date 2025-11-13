import bcrypt from "bcryptjs";
import { USERS_STORAGE_KEY } from "./constants/auth";
import type { UserData } from "./interface/user-data";
import { loadFromStorage, saveToStorage } from "./storage";


export const getActiveUserId = (): string | null => {
   try {
     const raw = localStorage.getItem("auth"); 
     if (!raw) return null;
     const parsed = JSON.parse(raw) as { user?: { id?: string } };
     return parsed?.user?.id ?? null;
   } catch {
     return null;
   }
 };

export const getAllUsers = (): UserData[] => {
  const stored = loadFromStorage(USERS_STORAGE_KEY, []);
  return Array.isArray(stored) ? (stored as UserData[]) : [];
};

const saveAllUsers = (users: UserData[]): void => {
  saveToStorage(USERS_STORAGE_KEY, users);
};


export const findUserByEmail = (emailAddress: string): UserData | null => {
  const normalized = emailAddress.trim().toLowerCase();
  const allUsers = getAllUsers();
  const matchedUser = allUsers.find(
    (user) => user.email.trim().toLowerCase() === normalized
  );
  return matchedUser ?? null;
};

export const updateUserPassword = (
  userId: string,
  newPassword: string
): boolean => {
  const allUsers = getAllUsers();
  let wasUpdated = false;

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const updatedUsers = allUsers.map((user) => {
    if (user.id === userId) {
      wasUpdated = true;
      return { ...user, password: hashedPassword };
    }
    return user;
  });

  if (wasUpdated) saveAllUsers(updatedUsers);
  return wasUpdated;
};