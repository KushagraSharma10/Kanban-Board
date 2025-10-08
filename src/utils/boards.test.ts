import { describe, it, expect } from 'vitest';
import { normalizeBoardName } from './boards';

describe('normalizeBoardName', () => {
  describe('happy path', () => {
    it('should normalize simple board name', () => {
      const result = normalizeBoardName('My Board');
      expect(result).toBe('my board');
    });

    it('should convert to lowercase', () => {
      const result = normalizeBoardName('PROJECT BOARD');
      expect(result).toBe('project board');
    });

    it('should trim whitespace', () => {
      const result = normalizeBoardName('  Board Name  ');
      expect(result).toBe('board name');
    });

    it('should collapse multiple spaces', () => {
      const result = normalizeBoardName('Board    Name');
      expect(result).toBe('board name');
    });

    it('should handle mixed case', () => {
      const result = normalizeBoardName('MiXeD CaSe BoArD');
      expect(result).toBe('mixed case board');
    });
  });

  describe('whitespace handling', () => {
    it('should remove leading whitespace', () => {
      const result = normalizeBoardName('   Board Name');
      expect(result).toBe('board name');
    });

    it('should remove trailing whitespace', () => {
      const result = normalizeBoardName('Board Name   ');
      expect(result).toBe('board name');
    });

    it('should remove leading and trailing whitespace', () => {
      const result = normalizeBoardName('   Board Name   ');
      expect(result).toBe('board name');
    });

    it('should collapse multiple spaces between words', () => {
      const result = normalizeBoardName('Board     Name     Here');
      expect(result).toBe('board name here');
    });

    it('should handle tabs as whitespace', () => {
      const result = normalizeBoardName('Board\t\tName');
      expect(result).toBe('board name');
    });

    it('should handle newlines as whitespace', () => {
      const result = normalizeBoardName('Board\n\nName');
      expect(result).toBe('board name');
    });

    it('should handle mixed whitespace characters', () => {
      const result = normalizeBoardName('Board \t\n  Name');
      expect(result).toBe('board name');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = normalizeBoardName('');
      expect(result).toBe('');
    });

    it('should handle string with only spaces', () => {
      const result = normalizeBoardName('     ');
      expect(result).toBe('');
    });

    it('should handle string with only tabs', () => {
      const result = normalizeBoardName('\t\t\t');
      expect(result).toBe('');
    });

    it('should handle string with only newlines', () => {
      const result = normalizeBoardName('\n\n\n');
      expect(result).toBe('');
    });

    it('should handle single word', () => {
      const result = normalizeBoardName('Board');
      expect(result).toBe('board');
    });

    it('should handle single word with spaces', () => {
      const result = normalizeBoardName('  Board  ');
      expect(result).toBe('board');
    });

    it('should handle single character', () => {
      const result = normalizeBoardName('A');
      expect(result).toBe('a');
    });

    it('should preserve multiple words correctly', () => {
      const result = normalizeBoardName('My Project Board Name');
      expect(result).toBe('my project board name');
    });
  });

  describe('special characters', () => {
    it('should preserve hyphens', () => {
      const result = normalizeBoardName('My-Board-Name');
      expect(result).toBe('my-board-name');
    });

    it('should preserve underscores', () => {
      const result = normalizeBoardName('My_Board_Name');
      expect(result).toBe('my_board_name');
    });

    it('should preserve numbers', () => {
      const result = normalizeBoardName('Project 2024 Board');
      expect(result).toBe('project 2024 board');
    });

    it('should preserve special characters', () => {
      const result = normalizeBoardName('Board Name (Active)');
      expect(result).toBe('board name (active)');
    });

    it('should handle emojis', () => {
      const result = normalizeBoardName('Board 🚀 Name');
      expect(result).toBe('board 🚀 name');
    });

    it('should handle punctuation', () => {
      const result = normalizeBoardName("Board's Name\!");
      expect(result).toBe("board's name\!");
    });
  });

  describe('consistency', () => {
    it('should produce same result for equivalent inputs', () => {
      const inputs = [
        'Board Name',
        '  Board   Name  ',
        'BOARD NAME',
        'board name',
        'Board    Name',
      ];

      const results = inputs.map(normalizeBoardName);
      const expected = 'board name';

      results.forEach(result => {
        expect(result).toBe(expected);
      });
    });

    it('should be idempotent', () => {
      const input = 'My Board Name';
      const result1 = normalizeBoardName(input);
      const result2 = normalizeBoardName(result1);

      expect(result1).toBe(result2);
    });

    it('should handle already normalized input', () => {
      const input = 'already normalized';
      const result = normalizeBoardName(input);

      expect(result).toBe(input);
    });
  });

  describe('real-world examples', () => {
    it('should normalize "Sprint Planning"', () => {
      expect(normalizeBoardName('Sprint Planning')).toBe('sprint planning');
    });

    it('should normalize "Q1 2024 Roadmap"', () => {
      expect(normalizeBoardName('Q1 2024 Roadmap')).toBe('q1 2024 roadmap');
    });

    it('should normalize "Bug Tracking Board"', () => {
      expect(normalizeBoardName('Bug Tracking Board')).toBe('bug tracking board');
    });

    it('should normalize "Design System v2"', () => {
      expect(normalizeBoardName('Design System v2')).toBe('design system v2');
    });

    it('should normalize messy user input', () => {
      expect(normalizeBoardName('   My    New     Board   ')).toBe('my new board');
    });
  });
});