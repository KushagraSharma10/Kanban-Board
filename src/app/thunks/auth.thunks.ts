import type { AppDispatch } from "../store/store";
import { setUser, loadSessionDone } from "../slices/auth.slice";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { getAllUsers } from "../../utils/auth";
import { saveToStorage } from "../../utils/storage";
import { createSession, getSession } from "../../utils/session";
import {
  USERS_STORAGE_KEY,
} from "../../utils/constants/auth";
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
} from "../../utils/validation";
import type { UserData } from "../../utils/interface/user-data";
import { toast } from "react-toastify";

const readAllUsersFromStorage = (): UserData[] => getAllUsers?.() ?? [];
const writeAllUsersToStorage = (users: UserData[]): void =>
  saveToStorage(USERS_STORAGE_KEY, users);

export const loadSession =
  () =>
  (dispatch: AppDispatch): void => {
    try {
      const existingSession = getSession?.();
      if (!existingSession?.userId) {
        dispatch(loadSessionDone(null));
        return;
      }
      const users = readAllUsersFromStorage();
      const foundUser = users.find((user) => user.id === existingSession.userId);
      if (!foundUser) {
        dispatch(loadSessionDone(null));
        return;
      }
      dispatch(
        loadSessionDone({
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        })
      );
    } catch {
      dispatch(loadSessionDone(null));
    }
  };

export const loginUser =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const users = readAllUsersFromStorage();

      const existing = users.find(
        (user) => user.email.toLowerCase() === normalizedEmail
      );

      if (!existing) {
        toast.error("Invalid credentials or please sign up first.");
        return;
      }
      const isValid = await bcrypt.compare(password, existing.password);
      if (!isValid) {
        toast.error("Invalid credentials or please sign up first.");
        return;
      }

      createSession(existing.id);
      dispatch(
        setUser({
          id: existing.id,
          name: existing.name,
          email: existing.email,
          role: existing.role,
        })
      );
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

export const signupUser =
  ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) =>
 async (dispatch: AppDispatch): Promise<void> => {
    try {
      const emailMessage = validateEmail(email);
      if (emailMessage) {
        toast.error(emailMessage);
        return;
      }
      const passwordMessage = validatePassword(password);
      if (passwordMessage) {
        toast.error(passwordMessage);
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const users = readAllUsersFromStorage();

      const isDuplicate = users.some(
        (user) => user.email.toLowerCase() === normalizedEmail
      );
      if (isDuplicate) {
        toast.error("An account with this email already exists.");
        return;
      }

      const hashedPassword =await bcrypt.hash(password, 10);
      const newUser: UserData = {
        id: nanoid(),
        name: name.trim() || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: hashedPassword,
        role: "member",
      };
      writeAllUsersToStorage([newUser, ...users]);

      createSession(newUser.id);
      dispatch(
        setUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        })
      );
    } catch {
      toast.error("Signup failed. Please try again.");
    }
  };
