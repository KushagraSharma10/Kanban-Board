import { describe, it, expect, beforeEach } from 'vitest';
import { setDragData, getDragData, moveItemWithinList, reorderById } from './drag-and-drop';
import type { DragPayload } from './types/drag-and-drop';

describe('drag-and-drop utilities', () => {
  describe('setDragData', () => {
    let mockEvent: any;

    beforeEach(() => {
      mockEvent = {
        dataTransfer: {
          effectAllowed: '',
          setData: (type: string, data: string) => {
            mockEvent.dataTransfer.data = { type, data };
          },
          data: {},
        },
      };
    });

    describe('happy path', () => {
      it('should set drag data with id', () => {
        const payload: DragPayload = { id: 'item-123' };
        setDragData(mockEvent, payload);

        expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
        expect(mockEvent.dataTransfer.data.type).toBe('text/plain');
        expect(mockEvent.dataTransfer.data.data).toBe(JSON.stringify(payload));
      });

      it('should set effectAllowed to move', () => {
        const payload: DragPayload = { id: 'item-abc' };
        setDragData(mockEvent, payload);

        expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
      });

      it('should serialize payload to JSON', () => {
        const payload: DragPayload = { id: 'complex-id-123' };
        setDragData(mockEvent, payload);

        const storedData = mockEvent.dataTransfer.data.data;
        expect(JSON.parse(storedData)).toEqual(payload);
      });
    });

    describe('edge cases', () => {
      it('should handle empty id', () => {
        const payload: DragPayload = { id: '' };
        setDragData(mockEvent, payload);

        const storedData = mockEvent.dataTransfer.data.data;
        expect(JSON.parse(storedData)).toEqual(payload);
      });

      it('should handle id with special characters', () => {
        const payload: DragPayload = { id: 'item-@#$%^&*()' };
        setDragData(mockEvent, payload);

        const storedData = mockEvent.dataTransfer.data.data;
        expect(JSON.parse(storedData)).toEqual(payload);
      });

      it('should handle very long id', () => {
        const payload: DragPayload = { id: 'item-' + 'a'.repeat(1000) };
        setDragData(mockEvent, payload);

        const storedData = mockEvent.dataTransfer.data.data;
        expect(JSON.parse(storedData)).toEqual(payload);
      });
    });
  });

  describe('getDragData', () => {
    let mockEvent: any;

    beforeEach(() => {
      mockEvent = {
        dataTransfer: {
          getData: (type: string) => mockEvent.dataTransfer.storedData || '',
          storedData: '',
        },
      };
    });

    describe('happy path', () => {
      it('should retrieve drag data', () => {
        const payload: DragPayload = { id: 'item-123' };
        mockEvent.dataTransfer.storedData = JSON.stringify(payload);

        const result = getDragData(mockEvent);
        expect(result).toEqual(payload);
      });

      it('should parse JSON correctly', () => {
        const payload: DragPayload = { id: 'item-abc-xyz' };
        mockEvent.dataTransfer.storedData = JSON.stringify(payload);

        const result = getDragData(mockEvent);
        expect(result?.id).toBe('item-abc-xyz');
      });
    });

    describe('error handling', () => {
      it('should return null when no data exists', () => {
        mockEvent.dataTransfer.storedData = '';

        const result = getDragData(mockEvent);
        expect(result).toBeNull();
      });

      it('should return null for invalid JSON', () => {
        mockEvent.dataTransfer.storedData = 'invalid json {';

        const result = getDragData(mockEvent);
        expect(result).toBeNull();
      });

      it('should return null for corrupted data', () => {
        mockEvent.dataTransfer.storedData = '{broken: json}';

        const result = getDragData(mockEvent);
        expect(result).toBeNull();
      });

      it('should not throw on parse errors', () => {
        mockEvent.dataTransfer.storedData = 'definitely not json';

        expect(() => getDragData(mockEvent)).not.toThrow();
        expect(getDragData(mockEvent)).toBeNull();
      });
    });

    describe('edge cases', () => {
      it('should handle empty id', () => {
        const payload: DragPayload = { id: '' };
        mockEvent.dataTransfer.storedData = JSON.stringify(payload);

        const result = getDragData(mockEvent);
        expect(result).toEqual(payload);
      });

      it('should handle whitespace-only data', () => {
        mockEvent.dataTransfer.storedData = '   ';

        const result = getDragData(mockEvent);
        expect(result).toBeNull();
      });

      it('should handle null in stored data', () => {
        mockEvent.dataTransfer.storedData = JSON.stringify(null);

        const result = getDragData(mockEvent);
        expect(result).toBeNull();
      });
    });
  });

  describe('moveItemWithinList', () => {
    describe('happy path', () => {
      it('should move item forward in list', () => {
        const list = ['a', 'b', 'c', 'd', 'e'];
        const result = moveItemWithinList(list, 1, 3);

        expect(result).toEqual(['a', 'c', 'd', 'b', 'e']);
      });

      it('should move item backward in list', () => {
        const list = ['a', 'b', 'c', 'd', 'e'];
        const result = moveItemWithinList(list, 3, 1);

        expect(result).toEqual(['a', 'd', 'b', 'c', 'e']);
      });

      it('should move item to start', () => {
        const list = ['a', 'b', 'c', 'd', 'e'];
        const result = moveItemWithinList(list, 3, 0);

        expect(result).toEqual(['d', 'a', 'b', 'c', 'e']);
      });

      it('should move item to end', () => {
        const list = ['a', 'b', 'c', 'd', 'e'];
        const result = moveItemWithinList(list, 1, 4);

        expect(result).toEqual(['a', 'c', 'd', 'e', 'b']);
      });

      it('should work with object items', () => {
        const list = [
          { id: '1', name: 'First' },
          { id: '2', name: 'Second' },
          { id: '3', name: 'Third' },
        ];
        const result = moveItemWithinList(list, 0, 2);

        expect(result).toEqual([
          { id: '2', name: 'Second' },
          { id: '3', name: 'Third' },
          { id: '1', name: 'First' },
        ]);
      });
    });

    describe('same position', () => {
      it('should return same list when fromIndex equals toIndex', () => {
        const list = ['a', 'b', 'c'];
        const result = moveItemWithinList(list, 1, 1);

        expect(result).toEqual(list);
      });

      it('should not mutate original list', () => {
        const list = ['a', 'b', 'c'];
        const original = [...list];
        moveItemWithinList(list, 1, 1);

        expect(list).toEqual(original);
      });
    });

    describe('edge cases', () => {
      it('should handle single item list', () => {
        const list = ['a'];
        const result = moveItemWithinList(list, 0, 0);

        expect(result).toEqual(['a']);
      });

      it('should handle two item list', () => {
        const list = ['a', 'b'];
        const result = moveItemWithinList(list, 0, 1);

        expect(result).toEqual(['b', 'a']);
      });

      it('should handle empty list', () => {
        const list: string[] = [];
        const result = moveItemWithinList(list, 0, 0);

        expect(result).toEqual([]);
      });

      it('should clamp toIndex beyond list length', () => {
        const list = ['a', 'b', 'c'];
        const result = moveItemWithinList(list, 0, 100);

        expect(result).toEqual(['b', 'c', 'a']);
      });

      it('should clamp negative toIndex to 0', () => {
        const list = ['a', 'b', 'c'];
        const result = moveItemWithinList(list, 2, -5);

        expect(result).toEqual(['c', 'a', 'b']);
      });

      it('should not mutate original list', () => {
        const list = ['a', 'b', 'c'];
        const original = [...list];
        moveItemWithinList(list, 0, 2);

        expect(list).toEqual(original);
      });
    });

    describe('complex items', () => {
      it('should work with numbers', () => {
        const list = [1, 2, 3, 4, 5];
        const result = moveItemWithinList(list, 1, 3);

        expect(result).toEqual([1, 3, 4, 2, 5]);
      });

      it('should preserve references', () => {
        const obj1 = { id: '1' };
        const obj2 = { id: '2' };
        const obj3 = { id: '3' };
        const list = [obj1, obj2, obj3];

        const result = moveItemWithinList(list, 0, 2);

        expect(result[2]).toBe(obj1);
        expect(result[0]).toBe(obj2);
      });
    });
  });

  describe('reorderById', () => {
    type TestItem = { id: string; name?: string };

    describe('happy path', () => {
      it('should reorder item before target', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
          { id: 'd', name: 'D' },
        ];

        const result = reorderById(list, 'c', 'a', 'before');
        expect(result.map(i => i.id)).toEqual(['c', 'a', 'b', 'd']);
      });

      it('should reorder item after target', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
          { id: 'd', name: 'D' },
        ];

        const result = reorderById(list, 'a', 'c', 'after');
        expect(result.map(i => i.id)).toEqual(['b', 'c', 'a', 'd']);
      });

      it('should move item to end with "end" position', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
        ];

        const result = reorderById(list, 'a', null, 'end');
        expect(result.map(i => i.id)).toEqual(['b', 'c', 'a']);
      });

      it('should default to "before" when position not specified', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
        ];

        const result = reorderById(list, 'c', 'a');
        expect(result.map(i => i.id)).toEqual(['c', 'a', 'b']);
      });
    });

    describe('invalid source', () => {
      it('should return original list when sourceId not found', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ];

        const result = reorderById(list, 'nonexistent', 'a', 'before');
        expect(result).toEqual(list);
      });

      it('should not mutate original list when sourceId invalid', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ];
        const original = [...list];

        reorderById(list, 'invalid', 'a', 'before');
        expect(list).toEqual(original);
      });
    });

    describe('invalid target', () => {
      it('should return original list when targetId not found', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
        ];

        const result = reorderById(list, 'a', 'nonexistent', 'before');
        expect(result).toEqual(list);
      });

      it('should move to end when targetId is null and position is "end"', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
        ];

        const result = reorderById(list, 'a', null, 'end');
        expect(result.map(i => i.id)).toEqual(['b', 'c', 'a']);
      });
    });

    describe('edge cases', () => {
      it('should handle moving forward in list', () => {
        const list: TestItem[] = [
          { id: 'a' },
          { id: 'b' },
          { id: 'c' },
          { id: 'd' },
        ];

        const result = reorderById(list, 'b', 'd', 'before');
        expect(result.map(i => i.id)).toEqual(['a', 'c', 'b', 'd']);
      });

      it('should handle moving backward in list', () => {
        const list: TestItem[] = [
          { id: 'a' },
          { id: 'b' },
          { id: 'c' },
          { id: 'd' },
        ];

        const result = reorderById(list, 'c', 'a', 'after');
        expect(result.map(i => i.id)).toEqual(['a', 'c', 'b', 'd']);
      });

      it('should handle adjacent items', () => {
        const list: TestItem[] = [
          { id: 'a' },
          { id: 'b' },
          { id: 'c' },
        ];

        const result = reorderById(list, 'a', 'b', 'after');
        expect(result.map(i => i.id)).toEqual(['b', 'a', 'c']);
      });

      it('should handle single item list', () => {
        const list: TestItem[] = [{ id: 'a' }];

        const result = reorderById(list, 'a', null, 'end');
        expect(result.map(i => i.id)).toEqual(['a']);
      });

      it('should not mutate original list', () => {
        const list: TestItem[] = [
          { id: 'a' },
          { id: 'b' },
          { id: 'c' },
        ];
        const original = list.map(i => ({ ...i }));

        reorderById(list, 'a', 'c', 'before');
        
        expect(list.map(i => i.id)).toEqual(original.map(i => i.id));
      });

      it('should preserve object properties', () => {
        const list: TestItem[] = [
          { id: 'a', name: 'First' },
          { id: 'b', name: 'Second' },
          { id: 'c', name: 'Third' },
        ];

        const result = reorderById(list, 'c', 'a', 'before');
        
        expect(result.find(i => i.id === 'c')?.name).toBe('Third');
      });
    });

    describe('position adjustments', () => {
      it('should adjust index when moving forward with "before"', () => {
        const list: TestItem[] = [
          { id: 'a' },
          { id: 'b' },
          { id: 'c' },
          { id: 'd' },
          { id: 'e' },
        ];

        const result = reorderById(list, 'b', 'e', 'before');
        expect(result.map(i => i.id)).toEqual(['a', 'c', 'd', 'b', 'e']);
      });

      it('should adjust index when moving backward with "after"', () => {
        const list: TestItem[] = [
          { id: 'a' },
          { id: 'b' },
          { id: 'c' },
          { id: 'd' },
          { id: 'e' },
        ];

        const result = reorderById(list, 'd', 'a', 'after');
        expect(result.map(i => i.id)).toEqual(['a', 'd', 'b', 'c', 'e']);
      });
    });
  });
});