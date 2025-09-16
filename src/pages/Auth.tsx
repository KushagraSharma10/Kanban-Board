import { useState } from "react";
import LeftPanel from "../components/auth/LeftPanel";
import AuthFormFields from "../components/auth/AuthFormFields";
import { LOGIN_MODE, SIGNUP_MODE} from "../constants/AuthConstants";
import type { Field, FormFields, Props } from "../types/auth";
import { checkUser, getUsers, saveUser, type UserData } from "../utils/local-storage";
import { AuthContent, AuthMain, AuthWrapper } from "../styles/auth/auth-main";
import { AuthBrand, AuthDivider, AuthFooter, AuthHeading, AuthLine, AuthRowRight, AuthSubText } from "../styles/auth/auth-others";
import { AuthForm } from "../styles/auth/auth-form";
import { AuthLink, AuxLink } from "../styles/auth/auth-link";
import { AuthButton, GoogleBtn } from "../styles/auth/auth-button";

export default function Auth({ mode }: Props) {
  const isLogin = mode === LOGIN_MODE;

  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      const isValid = checkUser(form.email, form.password);
      if (isValid) {
        console.log("Login successful");
        alert("Login successful");
      } else {
        alert("Invalid credentials or please signup first");
      }
    } else {
      const users = getUsers();
    if (users[form.email]) {
      alert("User already exists, please login.");
    } else {
      const newUser: UserData = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      saveUser(newUser);
      alert("Signup successful! Please login.");
    }
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
            {isLogin && (
              <AuthRowRight>
                <AuxLink href="#">Forget Password?</AuxLink>
              </AuthRowRight>
            )}
            <AuthButton type="submit">{isLogin ? LOGIN_MODE : SIGNUP_MODE}</AuthButton>
          </AuthForm>
          <AuthDivider>
            <AuthLine />
            <span>OR</span>
            <AuthLine />
          </AuthDivider>
          <GoogleBtn type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 533.5 544.3" aria-hidden="true">
              <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.6-37.2-5-55.3H272v104.9h147.5c-6.1 33.8-24.6 62.2-52.4 81.4v67h84.5c49.5-45.6 81.9-113 81.9-197.9z"/>
              <path fill="#34A853" d="M272 544.3c70.8 0 130.3-23.5 173.8-64.3l-84.5-67c-23.5 16.1-53.5 25.3-89.3 25.3-68.6 0-126.7-46.2-147.4-108.1h-87.3v68.3C81.1 486.7 171.1 544.3 272 544.3z"/>
              <path fill="#FBBC05" d="M124.6 329.8c-10.5-31.4-10.5-65.3 0-96.7V164.9h-87.3c-38.5 76.8-38.5 168.9 0 245.7l87.3-80.8z"/>
              <path fill="#EA4335" d="M272 107.7c37.9 0 71.9 13 98.5 38.3l73.5-73.5C402.3 24.7 342.8 0 272 0 171.1 0 81.1 57.6 37.3 146.6l87.3 68.3C145.3 153.9 203.4 107.7 272 107.7z"/>
            </svg>
            <span>{isLogin ? "Continue with Google" : "Sign up with Google"}</span>
          </GoogleBtn>
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
