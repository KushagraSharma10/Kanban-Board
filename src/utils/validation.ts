export const validatePassword = (password: string): string | null => {
  const minLength = 8;
  const uppercasePattern = /[A-Z]/;
  const lowercasePattern = /[a-z]/;
  const digitPattern = /\d/;
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

  switch (true) {
    case password.length < minLength:
      return "Password must be at least 8 characters long.";

    case !uppercasePattern.test(password):
      return "Password must contain at least one uppercase letter.";

    case !lowercasePattern.test(password):
      return "Password must contain at least one lowercase letter.";

    case !digitPattern.test(password):
      return "Password must contain at least one digit.";

    case !specialCharPattern.test(password):
      return "Password must contain at least one special character.";

    default:
      return null;
  }
};

export const validateEmail = (email: string): string | null => {
  const emailPattern = /^[a-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }

  return null;
};

export const normalizeEmail = (email: string) => {
  return email.trim().toLowerCase();
};
