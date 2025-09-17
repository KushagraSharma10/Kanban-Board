import { LOGIN_MODE, SIGNUP_MODE } from "../constants/AuthConstants";

export type Mode = typeof LOGIN_MODE | typeof SIGNUP_MODE;

export type FormFields = {
  name: string;
  email: string;
  password: string;
};

export type Field = {
  id: string;
  name: keyof FormFields;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
};

export type Props = {
  mode: Mode;
};

export type BoardItem = {
  id: string;
  name: string;
  type: string;
  color: string;
};

export interface UserData {
  name: string;
  email: string;
  password: string;
}