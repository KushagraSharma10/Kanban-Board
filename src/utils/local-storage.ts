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

export const saveUser = (user: UserData): void => {
  const users = getUsers();
  users[user.email] = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const checkUser = (email: string, password: string): boolean => {
  const users = getUsers();
  if (!users[email]) return false;
  return users[email].password === password;
};
