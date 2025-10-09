import { describe, it, expect } from 'vitest'
import { getActiveUser, getAllUsers } from '../auth'
import { USERS_STORAGE_KEY } from '../constants/auth'
import { SESSION_STORAGE_KEY } from '../constants/session'

describe('auth.ts', () => {
  it('getAllUsers returns empty array by default', () => {
    localStorage.removeItem(USERS_STORAGE_KEY)
    expect(getAllUsers()).toEqual([])
  })

  it('getAllUsers returns parsed users when present', () => {
    const users = [{ id: 'u1', name: 'N', email: 'e', password: 'p', role: 'member' as const }]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    expect(getAllUsers()).toEqual(users)
  })

  it('getActiveUser returns null when no session', () => {
    localStorage.removeItem(USERS_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    expect(getActiveUser()).toBeNull()
  })

  it('getActiveUser returns user when session matches', () => {
    const users = [
      { id: 'u1', name: 'A', email: 'a@e.com', password: 'hash', role: 'member' as const },
      { id: 'u2', name: 'B', email: 'b@e.com', password: 'hash', role: 'admin' as const },
    ]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: 'u2', createdAt: Date.now() }))
    expect(getActiveUser()).toEqual(users[1])
  })

  it('getActiveUser returns null when session user not found', () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]))
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: 'missing', createdAt: Date.now() }))
    expect(getActiveUser()).toBeNull()
  })
})