
import type { AuthMode } from "../constants/auth";
import type { Field, FormFields } from "./form"

export type AuthProp = {
  fields: Field[];
  form: FormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ModeProp = {
  mode: AuthMode;
};
