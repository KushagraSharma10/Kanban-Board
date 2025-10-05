import type { SessionData } from "react-router";
import { SESSION_STORAGE_KEY } from "./constants/auth";

export function getSession(): SessionData | null {
  try {
    const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (rawSession) {
      return JSON.parse(rawSession);
    }
    return null;
  } catch (error) {
    console.error("Failed to retrieve session from sessionStorage:", error);
    return null;
  }
}

export function createSession(userId: string): void {
  try {
    const session = {
      userId: userId,
      createdAt: Date.now(),
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to create session in sessionStorage:", error);
  }
}