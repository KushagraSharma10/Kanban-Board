export function validatePassword(password: string): string | null {
  const minLength = 8;
  const uppercasePattern = /[A-Z]/;
  const lowercasePattern = /[a-z]/;
  const digitPattern = /\d/;
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength) {
    return "Password must be at least 8 characters long.";
  }
  if (!uppercasePattern.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!lowercasePattern.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!digitPattern.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!specialCharPattern.test(password)) {
    return "Password must contain at least one special character.";
  }

  return null;
}
