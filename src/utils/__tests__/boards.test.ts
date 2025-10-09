import { describe, it, expect } from 'vitest'
import { normalizeBoardName } from '../boards'

describe('boards.ts', () => {
  it('normalizes name by trimming extra spaces and lowercasing', () => {
    expect(normalizeBoardName('  My    Cool   Board  ')).toBe('my cool board')
    expect(normalizeBoardName('Single')).toBe('single')
    expect(normalizeBoardName('')).toBe('')
    expect(normalizeBoardName('   ')).toBe('')
  })
})