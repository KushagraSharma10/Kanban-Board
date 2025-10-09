import { describe, it, expect } from 'vitest'
import { loadFromStorage, saveToStorage } from '../storage'

describe('storage.ts', () => {
  const KEY = 'test.key'

  it('saves and loads JSON values', () => {
    saveToStorage(KEY, { a: 1 })
    const val = loadFromStorage(KEY, null) as any
    expect(val).toEqual({ a: 1 })
  })

  it('returns default when key missing', () => {
    const def = { foo: 'bar' }
    const val = loadFromStorage('missing.key', def)
    expect(val).toEqual(def)
  })

  it('returns default when value is invalid JSON', () => {
    // Simulate invalid JSON
    window.localStorage.setItem(KEY, '{ invalid json')
    const def = { v: 2 }
    expect(loadFromStorage(KEY, def)).toEqual(def)
  })
})