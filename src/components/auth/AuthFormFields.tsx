import type { AuthProp } from "../../utils/types/auth";
import {
  FieldLabel,
  Field as FieldContainer,
} from "../../styles/auth/auth-form";
import { AuthInput } from "../../styles/auth/auth-input";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";

const AuthFormFields: React.FC<AuthProp> = ({
  fields,
  form,
  onChange,
}: AuthProp) => {
  const [visibilityByFieldId, setVisibilityByFieldId] = useState<
    Record<string, boolean>
  >({});

  const toggleVisibility = (fieldId: string): void => {
    setVisibilityByFieldId((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  return (
    <>
      {fields.map((field) => {
        const isPasswordField = field.type === "password";
        const isVisible = !!visibilityByFieldId[field.id];

        return (
          <FieldContainer key={field.id}>
            <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>

            <div className="relative">
              <AuthInput
                id={field.id}
                name={field.name}
                type={
                  isPasswordField
                    ? isVisible
                      ? "text"
                      : "password"
                    : field.type
                }
                placeholder={field.placeholder}
                required={field.required}
                value={form[field.name]}
                onChange={onChange}
                className={isPasswordField ? "pr-12" : undefined}
              />

              {isPasswordField && (
                <button
                  type="button"
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  onClick={() => toggleVisibility(field.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xl px-2 py-1 text-[#a3b1c2] hover:text-white"
                >
                  {isVisible ? <BiHide /> : <BiShow />}
                </button>
              )}
            </div>
          </FieldContainer>
        );
      })}
    </>
  );
};

export default AuthFormFields;
