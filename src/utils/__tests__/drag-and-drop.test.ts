import { describe, it, expect } from 'vitest'
import { setDragData, getDragData, moveItemWithinList, reorderById } from '../drag-and-drop'

function mockDragEvent() {
  const store: Record<string, string> = {}
  return {
    dataTransfer: {
      effectAllowed: '',
      setData: (type: string, value: string) => { store[type] = value },
      getData: (type: string) => store[type] ?? '',
      dropEffect: 'move',
    },
  } as unknown as React.DragEvent
}

describe('drag-and-drop.ts', () => {
  describe('setDragData/getDragData', () => {
    it('sets and reads payload from dataTransfer', () => {
      const evt = mockDragEvent()
      setDragData(evt, { id: '123' })
      expect((evt as any).dataTransfer.effectAllowed).toBe('move')
      const payload = getDragData(evt)
      expect(payload).toEqual({ id: '123' })
    })

    it('returns null for invalid or missing payload', () => {
      const evt = mockDragEvent()
      // No setData => missing
      expect(getDragData(evt)).toBeNull()

      // Invalid JSON
      ;(evt as any).dataTransfer.setData('text/plain', '{bad')
      expect(getDragData(evt)).toBeNull()
    })
  })

  describe('moveItemWithinList', () => {
    it('moves element within bounds', () => {
      const list = ['a','b','c','d']
      expect(moveItemWithinList(list, 1, 3)).toEqual(['a','c','d','b'])
      expect(moveItemWithinList(list, 2, 0)).toEqual(['c','a','b','d'])
    })

    it('returns original when indices are equal', () => {
      const list = ['x','y','z']
      expect(moveItemWithinList(list, 1, 1)).toEqual(list)
    })

    it('clamps indices to valid ranges', () => {
      const list = ['a','b','c']
      expect(moveItemWithinList(list, 0, 99)).toEqual(['b','c','a'])
      expect(moveItemWithinList(list, 2, -10)).toEqual(['c','a','b'])
    })
  })

  describe('reorderById', () => {
    const list = [
      { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' },
    ]

    it('moves before target respecting source < target adjustment', () => {
      const r = reorderById(list, 'B', 'D', 'before')
      expect(r.map(i => i.id)).toEqual(['A','C','B','D'])
    })

    it('moves after target when source > target', () => {
      const r = reorderById(list, 'C', 'A', 'after')
      expect(r.map(i => i.id)).toEqual(['A','C','B','D'])
    })

    it('moves to end when position is end', () => {
      const r = reorderById(list, 'B', 'C', 'end')
      expect(r.map(i => i.id)).toEqual(['A','C','D','B'])
    })

    it('moves to end when targetId is null', () => {
      const r = reorderById(list, 'A', null, 'before')
      expect(r.map(i => i.id)).toEqual(['B','C','D','A'])
    })

    it('returns original when ids not found', () => {
      expect(reorderById(list, 'X', 'A')).toEqual(list)
      expect(reorderById(list, 'A', 'X')).toEqual(list)
    })
  })
})