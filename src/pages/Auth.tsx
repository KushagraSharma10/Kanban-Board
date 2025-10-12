import { useEffect, useState } from "react";
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
import { validateEmail, validatePassword } from "../utils/validation";
import type { ModeProp } from "../utils/types/auth";
import AuthSidebar from "../components/auth/AuthSidebar";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { loginUser, signupUser } from "../app/thunks/auth.thunks";
import { selectAuthUser } from "../app/slices/auth.slice";
import { toast } from "react-toastify";
import { AuthMode } from "../utils/enum/auth";
import ForgotPassword from "../components/auth/ForgotPassword";

const Auth: React.FC<ModeProp> = ({ mode }: ModeProp) => {
  const isLoginMode = mode === AuthMode.Login;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    password: "",
  });
  const authenticatedUser = useAppSelector(selectAuthUser);

  const handleInputChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = changeEvent.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const handleFormSubmit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const rawPassword = form.password;

    const emailValidationMessage = validateEmail(trimmedEmail);
    if (emailValidationMessage) {
      toast.error(emailValidationMessage);
      return;
    }

    if (isLoginMode) {
      dispatch(loginUser({ email: trimmedEmail, password: rawPassword }));
    } else {
      if (!trimmedName) {
        toast.error("Please enter your name");
        return;
      }
      const passwordValidationMessage = validatePassword(rawPassword);
      if (passwordValidationMessage) {
        toast.error(passwordValidationMessage);
        return;
      }
      dispatch(
        signupUser({
          name: trimmedName,
          email: trimmedEmail,
          password: rawPassword,
        })
      );
    }
  };

  useEffect(() => {
    if (authenticatedUser) {
      navigate("/");
    }
  }, [authenticatedUser, navigate]);

  const fields: Field[] = [
    ...(!isLoginMode
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
          <h2>{isLoginMode ? "Welcome Back" : "Create your account"}</h2>
          <p>
            {isLoginMode
              ? "Please enter your details to sign in."
              : "Start managing your work in one place."}
          </p>
          <AuthForm onSubmit={handleFormSubmit}>
            <AuthFormFields
              fields={fields}
              form={form}
              onChange={handleInputChange}
            />

            {isLoginMode && (
              <div className="text-end" >
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-sm text-[#6ca0ff] underline cursor-pointer"
                  
                >
                  Forgot password?
                </button>
              </div>
            )}
            <AuthButton type="submit">
              {isLoginMode ? AuthMode.Login : AuthMode.SignUP}
            </AuthButton>
          </AuthForm>
          <AuthDivider>
            <AuthLine />
            <span>OR</span>
            <AuthLine />
          </AuthDivider>
          <AuthFooter>
            {isLoginMode ? (
              <>
                Don’t have an account?{" "}
                <AuthLink href="/signup">Sign Up</AuthLink>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <AuthLink href="/login">Login</AuthLink>
              </>
            )}
          </AuthFooter>
        </AuthContent>
      </AuthWrapper>
      <ForgotPassword
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </AuthMain>
  );
};
export default Auth;
