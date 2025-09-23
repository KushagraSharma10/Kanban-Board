import { LOGIN_MODE, SIGNUP_MODE } from "../constants/auth";
import type { Field, FormFields } from "./form"

export type Mode = typeof LOGIN_MODE | typeof SIGNUP_MODE;

export type AuthProp = {
  fields: Field[];
  form: FormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ModeProp = {
  mode: Mode;
};
