import type { AuthUser, BackendRole } from "../types/auth";

export interface BackendUserDTO {
  id: string;
  fullName: string;
  email: string;
  role: BackendRole[];
}
export interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}
export interface AuthData {
  user: BackendUserDTO;
  accessToken: string;
}

export interface AuthStateWithToken {
  user: AuthUser | null;
  accessToken: string | null;
}
