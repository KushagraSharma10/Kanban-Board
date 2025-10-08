import { saveToStorage } from "./storage";
import { getAllUsers } from "./auth";
import { USERS_STORAGE_KEY } from "./constants/auth";
import { seedUsers } from "../data/seed-users";

export const seedInitialUsers = () => {
  const existingUsers = getAllUsers();

  if (!existingUsers.length) {
    saveToStorage(USERS_STORAGE_KEY, seedUsers);
  }
};