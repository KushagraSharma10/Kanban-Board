import bcrypt from "bcryptjs";
import type { BoardItem } from "../types/auth";

export interface UserData {
  name: string;
  email: string;
  password: string;
}

const STORAGE_KEY = "users";

export const getUsers = (): Record<string, UserData> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export function saveUser(name: string, email: string, password: string) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const hashed = bcrypt.hashSync(password, 10);

  users[email.toLowerCase()] = { name, email: email.toLowerCase(), password: hashed };
  localStorage.setItem("users", JSON.stringify(users));
}

export function checkUser(email: string, password: string): boolean {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const user = users[email.toLowerCase()];
  if (!user) return false;

  return bcrypt.compareSync(password, user.password);
}

const LS_KEY = "kanban.boards";

export function loadBoards(): BoardItem[] {
  try {
    const boards = localStorage.getItem(LS_KEY);
    return boards ? (JSON.parse(boards) as BoardItem[]) : [];
  } catch {
    return [];
  }
}

export function saveBoards(boards: BoardItem[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(boards));
  } catch (err) {
    console.error(err)
  }
}
