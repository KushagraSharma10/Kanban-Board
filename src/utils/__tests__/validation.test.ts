import { describe, it, expect } from 'vitest'
import { validatePassword, validateEmail, normalizeEmail } from '../validation'

describe('validation.ts', () => {
  describe('validatePassword', () => {
    it('returns null for a strong password', () => {
      expect(validatePassword('Aa1\!aaaa')).toBeNull()
      expect(validatePassword('StrongP@ssw0rd\!')).toBeNull()
    })

    it('fails when too short', () => {
      expect(validatePassword('Aa1\!aaa')).toBe('Password must be at least 8 characters long.')
    })

    it('fails when missing uppercase', () => {
      expect(validatePassword('aa1\!aaaa')).toBe('Password must contain at least one uppercase letter.')
    })

    it('fails when missing lowercase', () => {
      expect(validatePassword('AA1\!AAAA')).toBe('Password must contain at least one lowercase letter.')
    })

    it('fails when missing digit', () => {
      expect(validatePassword('AAa\!aaaa')).toBe('Password must contain at least one digit.')
    })

    it('fails when missing special character', () => {
      expect(validatePassword('AAa1aaaa')).toBe('Password must contain at least one special character.')
    })
  })

  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('user@example.com')).toBeNull()
      expect(validateEmail('User.Name+tag@example.co.uk')).toBeNull()
    })

    it('rejects invalid emails', () => {
      expect(validateEmail('user@')).toBe('Please enter a valid email address.')
      expect(validateEmail('user@domain')).toBe('Please enter a valid email address.')
      expect(validateEmail('not-an-email')).toBe('Please enter a valid email address.')
    })
  })

  describe('normalizeEmail', () => {
    it('trims and lowercases', () => {
      expect(normalizeEmail('  User@Example.Com ')).toBe('user@example.com')
      expect(normalizeEmail('LOWER@lower.io')).toBe('lower@lower.io')
    })
  })
})