import { describe, it, expect } from 'vitest'
import { saveBoardColumnOrder } from '../order-storage'
import type { StoredColumn } from '../types/column'

describe('order-storage.ts', () => {
  it('persists reordered columns by mapping to stored objects and filtering unknowns', () => {
    const boardId = 'b1'
    const stored: StoredColumn[] = [
      { id: '1', boardId, title: 'A', createdAt: 1 },
      { id: '2', boardId, title: 'B', createdAt: 2 },
      { id: '3', boardId, title: 'C', createdAt: 3 },
    ]

    const loadColumnsForBoard = (id: string) => id === boardId ? stored : []
    let saved: StoredColumn[] | null = null
    const saveColumnsForBoard = (_id: string, cols: StoredColumn[]) => { saved = cols }

    // Include an unknown id 'X' which should be filtered out
    const nextColumns = [{ id: '2', title: 'B' }, { id: 'X', title: 'X' }, { id: '1', title: 'A' }]
    saveBoardColumnOrder(boardId, nextColumns, loadColumnsForBoard, saveColumnsForBoard)

    expect(saved).not.toBeNull()
    // Order must match nextColumns but using full stored objects and without unknown 'X'
    expect(saved!.map(c => c.id)).toEqual(['2','1'])
    // Ensure createdAt preserved from stored items
    expect(saved![0].createdAt).toBe(2)
    expect(saved![1].createdAt).toBe(1)
  })
})