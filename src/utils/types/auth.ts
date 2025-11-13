import type { AuthMode } from "../enum/auth";
import type { UserData } from "../interface/user-data";
import type { Field, FormFields } from "./form";

export type AuthProp = {
  fields: Field[];
  form: FormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ModeProp = {
  mode: AuthMode;
};

export type AuthUser = Omit<UserData, "password">;

export type AuthState = {
  user: AuthUser | null;
};

export type ForgotPasswordProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type ForgotPasswordStage = "verifyEmail" | "setNewPassword";

export type BackendRole = "admin" | "user";
