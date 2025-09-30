import type { UserData } from "../utils/interface/user-data";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export const seedUsers: UserData[] = [
  {
    id: nanoid(),
    name: "Priya Sharma",
    email: "priya@example.com",
    password: bcrypt.hashSync("Priya@Admin123", 10),
    role: 'admin',
  },
  {
    id: nanoid(),
    name: "Rohan Gupta",
    email: "rohan@example.com",
    password: bcrypt.hashSync("Rohan@Member456", 10),
    role: 'admin',
  },
  {
    id: nanoid(),
    name: "Anjali Verma",
    email: "anjali@example.com",
    password: bcrypt.hashSync("Anjali@Member789", 10),
    role: 'admin',
  },
];