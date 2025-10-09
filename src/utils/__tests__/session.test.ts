import { describe, it, expect } from 'vitest'
import { createSession, getSession } from '../session'
import { SESSION_STORAGE_KEY } from '../constants/session'

describe('session.ts', () => {
  it('creates and retrieves session', () => {
    createSession('user-123')
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    expect(raw).toBeTruthy()
    const s = getSession()
    expect(s?.userId).toBe('user-123')
    expect(typeof s?.createdAt).toBe('number')
  })

  it('returns null for invalid JSON', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, '{bad')
    expect(getSession()).toBeNull()
  })

  it('returns null when missing', () => {
    sessionStorage.clear()
    expect(getSession()).toBeNull()
  })
})