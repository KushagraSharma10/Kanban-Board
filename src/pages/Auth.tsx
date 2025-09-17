import { useState } from "react";
import LeftPanel from "../components/auth/LeftPanel";
import AuthFormFields from "../components/auth/AuthFormFields";
import { LOGIN_MODE, SIGNUP_MODE} from "../constants/AuthConstants";
import type { Field, FormFields, Props } from "../types/auth";
import { checkUser, saveUser} from "../utils/local-storage";
import { AuthContent, AuthMain, AuthWrapper } from "../styles/auth/auth-main";
import { AuthBrand, AuthDivider, AuthFooter, AuthHeading, AuthLine, AuthSubText } from "../styles/auth/auth-main";
import { AuthForm } from "../styles/auth/auth-form";
import { AuthLink} from "../styles/auth/auth-link";
import { AuthButton } from "../styles/auth/auth-button";
import { useNavigate } from "react-router";
import { validateEmail } from "../utils/validation";

export default function Auth({ mode }: Props) {
  const isLogin = mode === LOGIN_MODE;

  const navigate = useNavigate();

  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

    const emailError = validateEmail(form.email);
    if (emailError) {
      alert(emailError);
      return; 
    }

  if (isLogin) {
    if (checkUser(form.email, form.password)) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials or please signup first");
    }
  } else {
    saveUser(form.name, form.email, form.password);
    alert("Signup successful! Please login.");
    navigate("/");
  }
};

  const fields: Field[] = [
    ...(!isLogin
      ? [
          {
            id: "name",
            name: "name" as keyof FormFields,
            type: "text",
            label: "Name",
            placeholder: "Your name",
          },
        ]
      : []),
    {
      id: "email",
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Email",
      required: true,
    },
    {
      id: "password",
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Password",
      required: true,
    },
  ];

  return (
    <AuthMain>
      <AuthWrapper>
        <LeftPanel />
        <AuthContent>
          <AuthBrand>
            <img src="/kanban.svg" alt="Kanban Logo" width={30} height={30} />
            Kanban Board
          </AuthBrand>
          <AuthHeading>{isLogin ? "Welcome Back" : "Create your account"}</AuthHeading>
          <AuthSubText>
            {isLogin
              ? "Please enter your details to sign in."
              : "Start managing your work in one place."}
          </AuthSubText>
          <AuthForm onSubmit={handleSubmit}>
            <AuthFormFields fields={fields} form={form} onChange={handleChange} />
            <AuthButton type="submit">{isLogin ? LOGIN_MODE : SIGNUP_MODE}</AuthButton>
          </AuthForm>
          <AuthDivider>
            <AuthLine />
            <span>OR</span>
            <AuthLine />
          </AuthDivider>
          <AuthFooter>
            {isLogin ? (
              <>
                Don’t have an account? <AuthLink href="/signup">Sign Up</AuthLink>
              </>
            ) : (
              <>
                Already have an account? <AuthLink href="/login">Login</AuthLink>
              </>
            )}
          </AuthFooter>
        </AuthContent>
      </AuthWrapper>
    </AuthMain>
  );
}
