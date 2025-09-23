import bcrypt from "bcryptjs";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import type { UserData } from "../interface/userData";
import { normalizeEmail } from "../utils/validation";

const USERS_STORAGE_KEY = "users";

export function getAllUsers(): UserData[] {
  const data = loadFromStorage(USERS_STORAGE_KEY, []);
  return Array.isArray(data) ? (data as UserData[]) : [];
}

function saveAllUsers(users: UserData[]) {
  saveToStorage(USERS_STORAGE_KEY, users);
}

export function registerUser(name: string, email: string, password: string): boolean {
  const users = getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => user.email === normalizedEmail)) {
    return false;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ name, email: normalizedEmail, password: hashedPassword });
  saveAllUsers(users);
  return true;
}

export function validateUser(email: string, password: string): boolean {
  const users = getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  const existingUser = users.find((user) => user.email === normalizedEmail);
  if (!existingUser) return false;

  return bcrypt.compareSync(password, existingUser.password);
}
