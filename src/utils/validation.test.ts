import { describe, it, expect } from 'vitest';
import { validatePassword, validateEmail, normalizeEmail } from './validation';

describe('validatePassword', () => {
  describe('happy path', () => {
    it('should return null for valid password with all requirements', () => {
      const result = validatePassword('ValidPass123\!');
      expect(result).toBeNull();
    });

    it('should return null for password with multiple special characters', () => {
      const result = validatePassword('Secure@Pass#2024$');
      expect(result).toBeNull();
    });

    it('should return null for password with exactly 8 characters', () => {
      const result = validatePassword('Valid1@a');
      expect(result).toBeNull();
    });

    it('should return null for very long valid password', () => {
      const result = validatePassword('VeryLongAndSecurePassword123\!@#$%^&*()');
      expect(result).toBeNull();
    });
  });

  describe('minimum length validation', () => {
    it('should return error for password shorter than 8 characters', () => {
      const result = validatePassword('Pass1\!');
      expect(result).toBe('Password must be at least 8 characters long.');
    });

    it('should return error for empty password', () => {
      const result = validatePassword('');
      expect(result).toBe('Password must be at least 8 characters long.');
    });

    it('should return error for 7 character password with all other requirements', () => {
      const result = validatePassword('Pass1\!a');
      expect(result).toBe('Password must be at least 8 characters long.');
    });
  });

  describe('uppercase letter validation', () => {
    it('should return error when no uppercase letter present', () => {
      const result = validatePassword('password123\!');
      expect(result).toBe('Password must contain at least one uppercase letter.');
    });

    it('should return error for all lowercase with numbers and special chars', () => {
      const result = validatePassword('secure@pass123');
      expect(result).toBe('Password must contain at least one uppercase letter.');
    });
  });

  describe('lowercase letter validation', () => {
    it('should return error when no lowercase letter present', () => {
      const result = validatePassword('PASSWORD123\!');
      expect(result).toBe('Password must contain at least one lowercase letter.');
    });

    it('should return error for all uppercase with numbers and special chars', () => {
      const result = validatePassword('SECURE@PASS123');
      expect(result).toBe('Password must contain at least one lowercase letter.');
    });
  });

  describe('digit validation', () => {
    it('should return error when no digit present', () => {
      const result = validatePassword('Password\!');
      expect(result).toBe('Password must contain at least one digit.');
    });

    it('should return error for letters and special chars only', () => {
      const result = validatePassword('Secure@Password\!');
      expect(result).toBe('Password must contain at least one digit.');
    });
  });

  describe('special character validation', () => {
    it('should return error when no special character present', () => {
      const result = validatePassword('Password123');
      expect(result).toBe('Password must contain at least one special character.');
    });

    it('should accept various special characters', () => {
      expect(validatePassword('Pass1234\!')).toBeNull();
      expect(validatePassword('Pass1234@')).toBeNull();
      expect(validatePassword('Pass1234#')).toBeNull();
      expect(validatePassword('Pass1234$')).toBeNull();
      expect(validatePassword('Pass1234%')).toBeNull();
      expect(validatePassword('Pass1234^')).toBeNull();
      expect(validatePassword('Pass1234&')).toBeNull();
      expect(validatePassword('Pass1234*')).toBeNull();
      expect(validatePassword('Pass1234(')).toBeNull();
      expect(validatePassword('Pass1234)')).toBeNull();
      expect(validatePassword('Pass1234,')).toBeNull();
      expect(validatePassword('Pass1234.')).toBeNull();
      expect(validatePassword('Pass1234?')).toBeNull();
      expect(validatePassword('Pass1234"')).toBeNull();
      expect(validatePassword('Pass1234:')).toBeNull();
      expect(validatePassword('Pass1234{')).toBeNull();
      expect(validatePassword('Pass1234}')).toBeNull();
      expect(validatePassword('Pass1234|')).toBeNull();
      expect(validatePassword('Pass1234<')).toBeNull();
      expect(validatePassword('Pass1234>')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle password with only spaces', () => {
      const result = validatePassword('        ');
      expect(result).toBe('Password must contain at least one uppercase letter.');
    });

    it('should handle password with unicode characters', () => {
      const result = validatePassword('Password123\!😀');
      expect(result).toBeNull();
    });

    it('should validate in correct order (length first)', () => {
      const result = validatePassword('pass');
      expect(result).toBe('Password must be at least 8 characters long.');
    });

    it('should handle password with tabs and newlines', () => {
      const result = validatePassword('Pass\n123\!\t');
      expect(result).toBeNull();
    });
  });
});

describe('validateEmail', () => {
  describe('happy path', () => {
    it('should return null for valid simple email', () => {
      const result = validateEmail('user@example.com');
      expect(result).toBeNull();
    });

    it('should return null for email with numbers', () => {
      const result = validateEmail('user123@example.com');
      expect(result).toBeNull();
    });

    it('should return null for email with dots in local part', () => {
      const result = validateEmail('first.last@example.com');
      expect(result).toBeNull();
    });

    it('should return null for email with plus sign', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result).toBeNull();
    });

    it('should return null for email with underscore', () => {
      const result = validateEmail('user_name@example.com');
      expect(result).toBeNull();
    });

    it('should return null for email with hyphen', () => {
      const result = validateEmail('user-name@example.com');
      expect(result).toBeNull();
    });

    it('should return null for email with percentage', () => {
      const result = validateEmail('user%test@example.com');
      expect(result).toBeNull();
    });

    it('should return null for subdomain email', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result).toBeNull();
    });

    it('should return null for country code TLD', () => {
      const result = validateEmail('user@example.co.uk');
      expect(result).toBeNull();
    });

    it('should return null for new TLDs', () => {
      expect(validateEmail('user@example.tech')).toBeNull();
      expect(validateEmail('user@example.io')).toBeNull();
      expect(validateEmail('user@example.dev')).toBeNull();
    });
  });

  describe('invalid email formats', () => {
    it('should return error for email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for email without domain', () => {
      const result = validateEmail('user@');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for email without local part', () => {
      const result = validateEmail('@example.com');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for email without TLD', () => {
      const result = validateEmail('user@example');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for empty string', () => {
      const result = validateEmail('');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for email with spaces', () => {
      const result = validateEmail('user name@example.com');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for multiple @ symbols', () => {
      const result = validateEmail('user@@example.com');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for email starting with dot', () => {
      const result = validateEmail('.user@example.com');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for email ending with dot before @', () => {
      const result = validateEmail('user.@example.com');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for consecutive dots', () => {
      const result = validateEmail('user..name@example.com');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should return error for single character TLD', () => {
      const result = validateEmail('user@example.c');
      expect(result).toBe('Please enter a valid email address.');
    });
  });

  describe('edge cases', () => {
    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      const result = validateEmail(longEmail);
      expect(result).toBeNull();
    });

    it('should handle email with all allowed special characters', () => {
      const result = validateEmail('user.name+tag-test%value@sub-domain.example.com');
      expect(result).toBeNull();
    });

    it('should reject email with only @', () => {
      const result = validateEmail('@');
      expect(result).toBe('Please enter a valid email address.');
    });

    it('should reject email with only domain part', () => {
      const result = validateEmail('example.com');
      expect(result).toBe('Please enter a valid email address.');
    });
  });
});

describe('normalizeEmail', () => {
  describe('happy path', () => {
    it('should convert email to lowercase', () => {
      const result = normalizeEmail('USER@EXAMPLE.COM');
      expect(result).toBe('user@example.com');
    });

    it('should trim whitespace from email', () => {
      const result = normalizeEmail('  user@example.com  ');
      expect(result).toBe('user@example.com');
    });

    it('should trim and lowercase together', () => {
      const result = normalizeEmail('  USER@EXAMPLE.COM  ');
      expect(result).toBe('user@example.com');
    });

    it('should preserve valid email structure', () => {
      const result = normalizeEmail('User.Name+Tag@Example.Com');
      expect(result).toBe('user.name+tag@example.com');
    });
  });

  describe('edge cases', () => {
    it('should handle email with only leading whitespace', () => {
      const result = normalizeEmail('   user@example.com');
      expect(result).toBe('user@example.com');
    });

    it('should handle email with only trailing whitespace', () => {
      const result = normalizeEmail('user@example.com   ');
      expect(result).toBe('user@example.com');
    });

    it('should handle email with tabs', () => {
      const result = normalizeEmail('\tuser@example.com\t');
      expect(result).toBe('user@example.com');
    });

    it('should handle email with newlines', () => {
      const result = normalizeEmail('\nuser@example.com\n');
      expect(result).toBe('user@example.com');
    });

    it('should handle empty string', () => {
      const result = normalizeEmail('');
      expect(result).toBe('');
    });

    it('should handle string with only whitespace', () => {
      const result = normalizeEmail('   ');
      expect(result).toBe('');
    });

    it('should preserve mixed case domains correctly', () => {
      const result = normalizeEmail('user@Example.COM');
      expect(result).toBe('user@example.com');
    });

    it('should not modify already normalized email', () => {
      const normalized = 'user@example.com';
      const result = normalizeEmail(normalized);
      expect(result).toBe(normalized);
    });
  });
});