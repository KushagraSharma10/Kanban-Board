import { describe, it, expect, vi } from 'vitest';
import { saveBoardColumnOrder } from './order-storage';
import type { StoredColumn } from './types/column';

describe('saveBoardColumnOrder', () => {
  describe('happy path', () => {
    it('should reorder columns based on nextColumns', () => {
      const boardId = 'board-123';
      const storedColumns: StoredColumn[] = [
        { id: 'col-1', boardId, title: 'Todo', createdAt: 1000 },
        { id: 'col-2', boardId, title: 'In Progress', createdAt: 2000 },
        { id: 'col-3', boardId, title: 'Done', createdAt: 3000 },
      ];

      const nextColumns = [
        { id: 'col-3', title: 'Done' },
        { id: 'col-1', title: 'Todo' },
        { id: 'col-2', title: 'In Progress' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      expect(loadColumnsForBoard).toHaveBeenCalledWith(boardId);
      expect(saveColumnsForBoard).toHaveBeenCalledWith(boardId, [
        { id: 'col-3', boardId, title: 'Done', createdAt: 3000 },
        { id: 'col-1', boardId, title: 'Todo', createdAt: 1000 },
        { id: 'col-2', boardId, title: 'In Progress', createdAt: 2000 },
      ]);
    });

    it('should preserve full column data including metadata', () => {
      const boardId = 'board-456';
      const storedColumns: StoredColumn[] = [
        { id: 'col-a', boardId, title: 'First', createdAt: 100 },
        { id: 'col-b', boardId, title: 'Second', createdAt: 200 },
      ];

      const nextColumns = [
        { id: 'col-b', title: 'Second' },
        { id: 'col-a', title: 'First' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns[0].createdAt).toBe(200);
      expect(savedColumns[1].createdAt).toBe(100);
    });

    it('should maintain order from nextColumns', () => {
      const boardId = 'board-789';
      const storedColumns: StoredColumn[] = [
        { id: '1', boardId, title: 'A', createdAt: 1 },
        { id: '2', boardId, title: 'B', createdAt: 2 },
        { id: '3', boardId, title: 'C', createdAt: 3 },
        { id: '4', boardId, title: 'D', createdAt: 4 },
      ];

      const nextColumns = [
        { id: '4', title: 'D' },
        { id: '2', title: 'B' },
        { id: '1', title: 'A' },
        { id: '3', title: 'C' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns.map(c => c.id)).toEqual(['4', '2', '1', '3']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty nextColumns', () => {
      const boardId = 'board-empty';
      const storedColumns: StoredColumn[] = [
        { id: 'col-1', boardId, title: 'Todo', createdAt: 1000 },
      ];

      const nextColumns: Array<{ id: string; title: string }> = [];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      expect(saveColumnsForBoard).toHaveBeenCalledWith(boardId, []);
    });

    it('should handle single column', () => {
      const boardId = 'board-single';
      const storedColumns: StoredColumn[] = [
        { id: 'col-only', boardId, title: 'Only Column', createdAt: 1000 },
      ];

      const nextColumns = [{ id: 'col-only', title: 'Only Column' }];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns).toHaveLength(1);
      expect(savedColumns[0].id).toBe('col-only');
    });

    it('should filter out columns not in stored data', () => {
      const boardId = 'board-filter';
      const storedColumns: StoredColumn[] = [
        { id: 'col-1', boardId, title: 'First', createdAt: 1000 },
        { id: 'col-2', boardId, title: 'Second', createdAt: 2000 },
      ];

      const nextColumns = [
        { id: 'col-1', title: 'First' },
        { id: 'col-nonexistent', title: 'Fake' },
        { id: 'col-2', title: 'Second' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns).toHaveLength(2);
      expect(savedColumns.map(c => c.id)).toEqual(['col-1', 'col-2']);
    });

    it('should handle columns with same titles', () => {
      const boardId = 'board-same';
      const storedColumns: StoredColumn[] = [
        { id: 'col-1', boardId, title: 'Todo', createdAt: 1000 },
        { id: 'col-2', boardId, title: 'Todo', createdAt: 2000 },
        { id: 'col-3', boardId, title: 'Todo', createdAt: 3000 },
      ];

      const nextColumns = [
        { id: 'col-3', title: 'Todo' },
        { id: 'col-1', title: 'Todo' },
        { id: 'col-2', title: 'Todo' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns.map(c => c.id)).toEqual(['col-3', 'col-1', 'col-2']);
      expect(savedColumns.map(c => c.createdAt)).toEqual([3000, 1000, 2000]);
    });

    it('should handle no stored columns', () => {
      const boardId = 'board-none';
      const storedColumns: StoredColumn[] = [];

      const nextColumns = [
        { id: 'col-1', title: 'First' },
        { id: 'col-2', title: 'Second' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns).toEqual([]);
    });
  });

  describe('function dependencies', () => {
    it('should call loadColumnsForBoard with correct boardId', () => {
      const boardId = 'board-dep-test';
      const storedColumns: StoredColumn[] = [];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(boardId, [], loadColumnsForBoard, saveColumnsForBoard);

      expect(loadColumnsForBoard).toHaveBeenCalledTimes(1);
      expect(loadColumnsForBoard).toHaveBeenCalledWith(boardId);
    });

    it('should call saveColumnsForBoard with correct boardId', () => {
      const boardId = 'board-save-test';
      const storedColumns: StoredColumn[] = [];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(boardId, [], loadColumnsForBoard, saveColumnsForBoard);

      expect(saveColumnsForBoard).toHaveBeenCalledTimes(1);
      expect(saveColumnsForBoard.mock.calls[0][0]).toBe(boardId);
    });

    it('should not call saveColumnsForBoard if loadColumnsForBoard returns empty', () => {
      const boardId = 'board-conditional';
      const loadColumnsForBoard = vi.fn(() => []);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(boardId, [], loadColumnsForBoard, saveColumnsForBoard);

      expect(saveColumnsForBoard).toHaveBeenCalled();
    });
  });

  describe('real-world scenarios', () => {
    it('should handle drag-and-drop reordering', () => {
      const boardId = 'kanban-board';
      const storedColumns: StoredColumn[] = [
        { id: 'todo', boardId, title: 'To Do', createdAt: Date.now() - 3000 },
        { id: 'progress', boardId, title: 'In Progress', createdAt: Date.now() - 2000 },
        { id: 'review', boardId, title: 'Review', createdAt: Date.now() - 1000 },
        { id: 'done', boardId, title: 'Done', createdAt: Date.now() },
      ];

      // User drags 'review' column before 'progress'
      const nextColumns = [
        { id: 'todo', title: 'To Do' },
        { id: 'review', title: 'Review' },
        { id: 'progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns.map(c => c.id)).toEqual(['todo', 'review', 'progress', 'done']);
    });

    it('should preserve timestamps after reordering', () => {
      const boardId = 'timestamp-test';
      const timestamps = {
        'col-1': 1000,
        'col-2': 2000,
        'col-3': 3000,
      };

      const storedColumns: StoredColumn[] = [
        { id: 'col-1', boardId, title: 'A', createdAt: timestamps['col-1'] },
        { id: 'col-2', boardId, title: 'B', createdAt: timestamps['col-2'] },
        { id: 'col-3', boardId, title: 'C', createdAt: timestamps['col-3'] },
      ];

      const nextColumns = [
        { id: 'col-2', title: 'B' },
        { id: 'col-3', title: 'C' },
        { id: 'col-1', title: 'A' },
      ];

      const loadColumnsForBoard = vi.fn(() => storedColumns);
      const saveColumnsForBoard = vi.fn();

      saveBoardColumnOrder(
        boardId,
        nextColumns,
        loadColumnsForBoard,
        saveColumnsForBoard
      );

      const savedColumns = saveColumnsForBoard.mock.calls[0][1];
      expect(savedColumns[0].createdAt).toBe(timestamps['col-2']);
      expect(savedColumns[1].createdAt).toBe(timestamps['col-3']);
      expect(savedColumns[2].createdAt).toBe(timestamps['col-1']);
    });
  });
});