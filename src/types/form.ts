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