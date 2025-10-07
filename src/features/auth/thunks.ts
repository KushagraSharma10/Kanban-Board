import type { AppDispatch } from "../../store/store";
import { setUser, clearUser, loadSessionDone } from "./auth-slice";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { getAllUsers } from "../../utils/auth";
import { saveToStorage } from "../../utils/storage";
import { createSession, getSession } from "../../utils/session";
import { USERS_STORAGE_KEY, SESSION_STORAGE_KEY } from "../../utils/constants/auth";
import { normalizeEmail, validateEmail, validatePassword } from "../../utils/validation";
import type { UserData } from "../../utils/interface/user-data";

const readAllUsersFromStorage = (): UserData[] => getAllUsers?.() ?? [];
const writeAllUsersToStorage = (users: UserData[]): void =>
  saveToStorage(USERS_STORAGE_KEY, users);

export const loadSession = () => (dispatch: AppDispatch): void => {
  try {
    const existingSession = getSession?.(); 
    if (!existingSession?.userId) {
      dispatch(loadSessionDone(null));
      return;
    }
    const users = readAllUsersFromStorage();
    const found = users.find((user) => user.id === existingSession.userId);
    if (!found) {
      dispatch(loadSessionDone(null));
      return;
    }
    dispatch(
      loadSessionDone({
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
      })
    );
  } catch {
    dispatch(loadSessionDone(null));
  }
};

export const loginUser =
  ({ email, password }: { email: string; password: string }) =>
  (dispatch: AppDispatch): void => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const users = readAllUsersFromStorage();

      const existing = users.find(
        (user) => user.email.toLowerCase() === normalizedEmail
      );

      if (!existing) {
        alert("Invalid credentials or please sign up first.");
        return;
      }
      const isValid = bcrypt.compareSync(password, existing.password);
      if (!isValid) {
        alert("Invalid credentials or please sign up first.");
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
      alert("Login failed. Please try again.");
    }
  };

export const signupUser =
  ({ name, email, password }: { name: string; email: string; password: string }) =>
  (dispatch: AppDispatch): void => {
    try {
      const emailMessage= validateEmail(email);
      if (emailMessage) {
        alert(emailMessage);
        return;
      }
      const passwordMessage = validatePassword(password);
      if (passwordMessage) {
        alert(passwordMessage);
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const users = readAllUsersFromStorage();

      const isDuplicate = users.some(
        (user) => user.email.toLowerCase() === normalizedEmail
      );
      if (isDuplicate) {
        alert("An account with this email already exists.");
        return;
      }

      const hashed = bcrypt.hashSync(password, 10);
      const newUser: UserData = {
        id: nanoid(),
        name: name.trim() || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: hashed,
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
      alert("Signup failed. Please try again.");
    }
  };

export const logoutUser = () => (dispatch: AppDispatch): void => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } finally {
    dispatch(clearUser());
  }
};
