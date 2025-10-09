import { describe, it, expect, vi } from 'vitest'
import { seedInitialUsers } from '../seed-users'
import { USERS_STORAGE_KEY } from '../constants/auth'

describe('seed-users.ts', () => {
  it('seeds only when no users exist', async () => {
    // Start with no users
    localStorage.removeItem(USERS_STORAGE_KEY)
    seedInitialUsers()
    const first = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
    expect(Array.isArray(first)).toBe(true)
    expect(first.length).toBeGreaterThanOrEqual(1) // there are 3 in seed

    // Calling again should not duplicate or overwrite
    seedInitialUsers()
    const second = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
    expect(second.length).toBe(first.length)
  })
})