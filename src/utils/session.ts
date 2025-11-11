import { SESSION_STORAGE_KEY } from "./constants/session";

export type StoredAuth = {
  accessToken: string;
  user: { id: string; name: string; email: string; role: "user" | "admin" };
};

export const getSession = (): StoredAuth | null => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed?.user?.id || !parsed?.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const getAccessTokenFromStorage = (): string | null => {
  const session = getSession();
  return session?.accessToken ?? null;
};


export const createSession= (userId: string): void => {
  try {
    const session = {
      userId: userId,
      createdAt: Date.now(),
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to create session in sessionStorage:", error);
  }
};
