import React, { useState } from "react";
import { toast } from "react-toastify";
import { validateEmail, validatePassword } from "../../utils/validation";
import { findUserByEmail, updateUserPassword } from "../../utils/auth";
import { BiHide, BiShow } from "react-icons/bi";
import type { ForgotPasswordProps, ForgotPasswordStage } from "../../utils/types/auth";

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose }) => {
  const [currentStage, setCurrentStage] = useState<ForgotPasswordStage>("verifyEmail");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [emailValidationError, setEmailValidationError] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordValidationError, setPasswordValidationError] = useState<string>("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  if (!isOpen) return null;

  const resetAllState = (): void => {
    setCurrentStage("verifyEmail");
    setEmailAddress("");
    setEmailValidationError("");
    setSelectedUserId("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordValidationError("");
    setIsNewPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  };

  const handleCloseModal = (): void => {
    resetAllState();
    onClose();
  };

  const handleSubmitEmail = (formEvent: React.FormEvent): void => {
    formEvent.preventDefault();
    setEmailValidationError("");

    const emailValidationMessage = validateEmail(emailAddress);
    if (emailValidationMessage) {
      setEmailValidationError(emailValidationMessage);
      return;
    }

    const foundUser = findUserByEmail(emailAddress);
    if (!foundUser) {
      toast.error("There is no user with this email.");
      return;
    }

    setSelectedUserId(foundUser.id);
    setCurrentStage("setNewPassword");
  };

  const handleSubmitNewPassword = (formEvent: React.FormEvent): void => {
    formEvent.preventDefault();
    setPasswordValidationError("");

    const passwordValidationMessage = validatePassword(newPassword);
    if (passwordValidationMessage) {
      setPasswordValidationError(passwordValidationMessage);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordValidationError("Passwords do not match.");
      return;
    }
    if (!selectedUserId) {
      setPasswordValidationError("Invalid flow. Please try again.");
      return;
    }

    updateUserPassword(selectedUserId, newPassword);
    toast.success("Password updated successfully.");
    handleCloseModal();
  };

  const passwordFieldConfigs = [
    {
      key: "newPassword",
      label: "New password",
      value: newPassword,
      isVisible: isNewPasswordVisible,
      onChange: (newValue: string) => {
        setNewPassword(newValue);
        if (passwordValidationError) setPasswordValidationError("");
      },
      toggleVisibility: () => setIsNewPasswordVisible((previous) => !previous),
    },
    {
      key: "confirmPassword",
      label: "Confirm password",
      value: confirmPassword,
      isVisible: isConfirmPasswordVisible,
      onChange: (newValue: string) => {
        setConfirmPassword(newValue);
        if (passwordValidationError) setPasswordValidationError("");
      },
      toggleVisibility: () => setIsConfirmPasswordVisible((previous) => !previous),
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-md rounded-lg border border-[#3a3f44] bg-[#161a21] p-6 text-[#e6edf3]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {currentStage === "verifyEmail" && "Forgot password"}
            {currentStage === "setNewPassword" && "Set a new password"}
          </h2>
          <button
            onClick={handleCloseModal}
            aria-label="Close"
            className="rounded px-2 py-1 text-[#a3b1c2] hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {currentStage === "verifyEmail" && (
          <form onSubmit={handleSubmitEmail}>
            <p className="mb-3 text-sm text-white/70">
              Enter your account email to continue.
            </p>

            <label className="mb-1 block text-sm text-white/70">Email address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(changeEvent) => {
                setEmailAddress(changeEvent.target.value);
                if (emailValidationError) setEmailValidationError("");
              }}
              className={`w-full rounded-md bg-[#0b0f14] px-3 py-2 outline-none border ${
                emailValidationError
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#3a3f44] focus:border-[#6ca0ff] focus:ring-2 focus:ring-[#0096ff]/30"
              }`}
              placeholder="you@example.com"
            />
            {emailValidationError && (
              <p className="mt-2 text-xs text-red-400">{emailValidationError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded border border-[#3a3f44] px-3 py-1.5 text-sm hover:brightness-110"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-[#0096ff] px-4 py-1.5 text-sm font-medium text-black hover:bg-[#6ca0ff]"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {currentStage === "setNewPassword" && (
          <form onSubmit={handleSubmitNewPassword}>
            {passwordFieldConfigs.map((fieldConfig, index) => (
              <div key={fieldConfig.key} className={index === 1 ? "mt-3" : ""}>
                <label className="mb-1 block text-sm text-white/70">
                  {fieldConfig.label}
                </label>
                <div className="relative">
                  <input
                    type={fieldConfig.isVisible ? "text" : "password"}
                    value={fieldConfig.value}
                    onChange={(event) => fieldConfig.onChange(event.target.value)}
                    className="w-full rounded-md bg-[#0b0f14] border border-[#3a3f44] px-3 py-2 pr-12 text-[#e6edf3] outline-none focus:border-[#6ca0ff] focus:ring-2 focus:ring-[#0096ff]/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={fieldConfig.toggleVisibility}
                    aria-label={fieldConfig.isVisible ? "Hide password" : "Show password"}
                    title={fieldConfig.isVisible ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xl px-2 py-1 text-[#a3b1c2] hover:text-white"
                  >
                    {fieldConfig.isVisible ? <BiHide /> : <BiShow />}
                  </button>
                </div>
              </div>
            ))}

            {passwordValidationError && (
              <p className="mt-2 text-sm text-red-400">{passwordValidationError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCurrentStage("verifyEmail")}
                className="rounded border border-[#3a3f44] px-3 py-1.5 text-sm hover:brightness-110"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded bg-[#0096ff] px-4 py-1.5 text-sm font-medium text-black hover:bg-[#6ca0ff]"
              >
                Update password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
