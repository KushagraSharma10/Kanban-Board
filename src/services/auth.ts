import bcrypt from "bcryptjs";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import type { UserData } from "../interface/userData";
import { nanoid } from "nanoid";

const USERS_STORAGE_KEY = "users";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAllUsers(): UserData[] {
  const storedUsers = loadFromStorage(USERS_STORAGE_KEY, []);
  if (!Array.isArray(storedUsers)) {
    return [];
  }
  return storedUsers as UserData[];
}

function saveAllUsers(users: UserData[]) {
  saveToStorage(USERS_STORAGE_KEY, users);
}

export function registerUser(name: string, email: string, password: string): boolean {
  const allUsers = getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  const userExists = allUsers.some((user) => user.email === normalizedEmail);
  if (userExists) return false;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: UserData = {
    id: nanoid(),
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  };

  saveAllUsers([...allUsers, newUser]);
  return true;
}

export function authenticateUser(email: string, password: string): UserData | null {
  const allUsers = getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  const matchedUser = allUsers.find((user) => user.email === normalizedEmail);
  if (!matchedUser) return null;

  const isPasswordValid = bcrypt.compareSync(password, matchedUser.password);
  return isPasswordValid ? matchedUser : null;
}
