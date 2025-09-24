import type { AuthProp } from "../../types/auth";
import { FieldLabel, Field as FieldContainer } from "../../styles/auth/auth-form";
import { AuthInput } from "../../styles/auth/auth-input";


const AuthFormFields : React.FC<AuthProp> = ({ fields, form, onChange }: AuthProp) => {
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

export default AuthFormFields;