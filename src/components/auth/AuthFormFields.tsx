import type { Field, FormFields } from "../../types/auth";
import { FieldLabel, Field as FieldContainer } from "../../styles/auth/auth-form";
import { AuthInput } from "../../styles/auth/auth-input";



type Props = {
  fields: Field[];
  form: FormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AuthFormFields({ fields, form, onChange }: Props) {
  return (
    <>
      {fields.map((field) => (
        <FieldContainer key={field.id}>
          <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
          <AuthInput
            id={field.id}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={form[field.name]}
            onChange={onChange}
          />
        </FieldContainer>
      ))}
    </>
  );
}
