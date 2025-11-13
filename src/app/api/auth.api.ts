import { apiClient } from "../../lib/apiClient";
import type { AuthData, Envelope } from "../../utils/interface/auth";

export const loginApi = async(
  email: string,
  password: string
): Promise<AuthData> => {
  const { data } = await apiClient.post<Envelope<AuthData>>("/auth/login", {
    email,
    password,
  });
  return data.data;
}

export const signupApi = async(
  fullName: string,
  email: string,
  password: string
): Promise<AuthData> => {
  const { data } = await apiClient.post<Envelope<AuthData>>("/auth/register", {
    fullName,
    email,
    password,
  });
  return data.data;
}

export const refreshApi = async(): Promise<AuthData> => {
  const { data } = await apiClient.post<Envelope<AuthData>>("/auth/refresh");
  return data.data;
}

export const logoutApi = async(): Promise<void> => {
  await apiClient.post("/auth/logout");
}
