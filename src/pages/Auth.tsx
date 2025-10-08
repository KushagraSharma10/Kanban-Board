import { useState } from "react";
import AuthFormFields from "../components/auth/AuthFormFields";
import type { Field, FormFields } from "../utils/types/form";
import { AuthContent, AuthMain, AuthWrapper } from "../styles/auth/auth-main";
import {
  AuthBrand,
  AuthDivider,
  AuthFooter,
  AuthLine,
} from "../styles/auth/auth-main";
import { AuthForm } from "../styles/auth/auth-form";
import { AuthLink } from "../styles/auth/auth-link";
import { AuthButton } from "../styles/auth/auth-button";
import { useNavigate } from "react-router";
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
} from "../utils/validation";
import type { ModeProp } from "../utils/types/auth";
import { saveToStorage } from "../utils/storage";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import {
  USERS_STORAGE_KEY,
} from "../utils/constants/auth";
import AuthSidebar from "../components/auth/AuthSidebar";
import type { UserData } from "../utils/interface/user-data";
import { AuthMode } from "../utils/enum/auth";
import { toast } from "react-toastify";
import { getAllUsers } from "../utils/auth";
import { createSession } from "../utils/session";

const Auth: React.FC<ModeProp> = ({ mode }: ModeProp) => {
  const isLogin = mode === AuthMode.Login;

  const navigate = useNavigate();

  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredName = form.name.trim();
    const enteredEmail = form.email.trim();
    const enteredPassword = form.password;

    const emailValidationMessage = validateEmail(enteredEmail);
    if (emailValidationMessage) {
      toast.error(emailValidationMessage);
      return;
    }

    if (isLogin) {
      const authenticatedUser = authenticateUser(enteredEmail, enteredPassword);
      if (authenticatedUser) {
        createSession(authenticatedUser.id);
        navigate("/");
      } else {
        toast.error("Invalid credentials or please sign up first.");
      }
    } else {
      if (!enteredName) {
        toast.error("Please enter your name");
        return;
      }

      const passwordValidationMessage = validatePassword(enteredPassword);
      if (passwordValidationMessage) {
        toast.error(passwordValidationMessage);
        return;
      }

      if (!canRegisterWithEmail(enteredEmail)) {
        toast.error("An account with this email already exists.");
        return;
      }
      createUserAndSave(enteredName, enteredEmail, enteredPassword);
      toast.success("Signup successful! Please login.");
      navigate("/login");
    }
  };

  const canRegisterWithEmail = (email: string): boolean =>{
    const allUsers = getAllUsers();
    const normalizedEmail = normalizeEmail(email);
    return !allUsers.some((user) => user.email === normalizedEmail);
  }

  const createUserAndSave = (
    name: string,
    email: string,
    password: string
  ): UserData =>{
    const allUsers = getAllUsers();
    const normalizedEmail = normalizeEmail(email);
    const hashed = bcrypt.hashSync(password, 10);

    const newUser: UserData = {
      id: nanoid(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role: "member",
    };

    const updatedUsers = [newUser, ...allUsers];
    saveToStorage(USERS_STORAGE_KEY, updatedUsers);

    return newUser;
  }

  const authenticateUser = (email: string, password: string): UserData | null => {
    const allUsers = getAllUsers();
    const normalizedEmail = normalizeEmail(email);
    const userFound = allUsers.find((user) => user.email === normalizedEmail);
    if (!userFound) return null;
    const isPasswordCorrect = bcrypt.compareSync(password, userFound.password);
    return isPasswordCorrect ? userFound : null;
  }

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
        <AuthSidebar />
        <AuthContent>
          <AuthBrand>
            <img src="/kanban.svg" alt="Kanban Logo" width={30} height={30} />
            Kanban Board
          </AuthBrand>
          <h2>{isLogin ? "Welcome Back" : "Create your account"}</h2>
          <p>
            {isLogin
              ? "Please enter your details to sign in."
              : "Start managing your work in one place."}
          </p>
          <AuthForm onSubmit={handleSubmit}>
            <AuthFormFields
              fields={fields}
              form={form}
              onChange={handleChange}
            />
            <AuthButton type="submit">
              {isLogin ? AuthMode.Login : AuthMode.SignUP}
            </AuthButton>
          </AuthForm>
          <AuthDivider>
            <AuthLine />
            <span>OR</span>
            <AuthLine />
          </AuthDivider>
          <AuthFooter>
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <AuthLink href="/signup">Sign Up</AuthLink>
              </>
            ) : (
              <>
                Already have an account? <AuthLink href="/">Login</AuthLink>
              </>
            )}
          </AuthFooter>
        </AuthContent>
      </AuthWrapper>
    </AuthMain>
  );
};
export default Auth;
