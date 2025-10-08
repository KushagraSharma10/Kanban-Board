import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadFromStorage, saveToStorage } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadFromStorage', () => {
    describe('happy path', () => {
      it('should load and parse valid JSON data', () => {
        const testData = { name: 'test', value: 123 };
        localStorage.setItem('testKey', JSON.stringify(testData));

        const result = loadFromStorage('testKey', null);
        expect(result).toEqual(testData);
      });

      it('should load string values', () => {
        localStorage.setItem('testKey', JSON.stringify('simple string'));

        const result = loadFromStorage('testKey', null);
        expect(result).toBe('simple string');
      });

      it('should load number values', () => {
        localStorage.setItem('testKey', JSON.stringify(42));

        const result = loadFromStorage('testKey', null);
        expect(result).toBe(42);
      });

      it('should load boolean values', () => {
        localStorage.setItem('testKey', JSON.stringify(true));

        const result = loadFromStorage('testKey', null);
        expect(result).toBe(true);
      });

      it('should load array values', () => {
        const testArray = [1, 2, 3, 'four'];
        localStorage.setItem('testKey', JSON.stringify(testArray));

        const result = loadFromStorage('testKey', []);
        expect(result).toEqual(testArray);
      });

      it('should load nested object structures', () => {
        const complexData = {
          user: {
            id: '123',
            profile: {
              name: 'John',
              age: 30,
              tags: ['developer', 'tester'],
            },
          },
        };
        localStorage.setItem('testKey', JSON.stringify(complexData));

        const result = loadFromStorage('testKey', null);
        expect(result).toEqual(complexData);
      });
    });

    describe('default value handling', () => {
      it('should return default value when key does not exist', () => {
        const defaultValue = { default: true };
        const result = loadFromStorage('nonexistent', defaultValue);
        expect(result).toEqual(defaultValue);
      });

      it('should return null default when key does not exist', () => {
        const result = loadFromStorage('nonexistent', null);
        expect(result).toBeNull();
      });

      it('should return empty array default when key does not exist', () => {
        const result = loadFromStorage('nonexistent', []);
        expect(result).toEqual([]);
      });

      it('should return empty object default when key does not exist', () => {
        const result = loadFromStorage('nonexistent', {});
        expect(result).toEqual({});
      });

      it('should return string default when key does not exist', () => {
        const result = loadFromStorage('nonexistent', 'default string');
        expect(result).toBe('default string');
      });

      it('should return number default when key does not exist', () => {
        const result = loadFromStorage('nonexistent', 0);
        expect(result).toBe(0);
      });

      it('should return boolean default when key does not exist', () => {
        const result = loadFromStorage('nonexistent', false);
        expect(result).toBe(false);
      });
    });

    describe('error handling', () => {
      it('should return default value when JSON parse fails', () => {
        localStorage.setItem('testKey', 'invalid json {');
        const defaultValue = { fallback: true };

        const result = loadFromStorage('testKey', defaultValue);
        expect(result).toEqual(defaultValue);
      });

      it('should handle corrupted data gracefully', () => {
        localStorage.setItem('testKey', '{broken: json}');

        const result = loadFromStorage('testKey', []);
        expect(result).toEqual([]);
      });

      it('should handle empty string value', () => {
        localStorage.setItem('testKey', '');

        const result = loadFromStorage('testKey', 'default');
        expect(result).toBe('default');
      });

      it('should handle undefined stored value', () => {
        localStorage.setItem('testKey', 'undefined');

        const result = loadFromStorage('testKey', 'default');
        expect(result).toBe('default');
      });
    });

    describe('edge cases', () => {
      it('should handle null stored as string', () => {
        localStorage.setItem('testKey', JSON.stringify(null));

        const result = loadFromStorage('testKey', 'default');
        expect(result).toBeNull();
      });

      it('should differentiate between missing key and null value', () => {
        localStorage.setItem('testKey', JSON.stringify(null));

        const resultWithKey = loadFromStorage('testKey', 'default');
        const resultWithoutKey = loadFromStorage('otherKey', 'default');

        expect(resultWithKey).toBeNull();
        expect(resultWithoutKey).toBe('default');
      });

      it('should handle very large data objects', () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          data: `item-${i}`,
        }));
        localStorage.setItem('testKey', JSON.stringify(largeArray));

        const result = loadFromStorage('testKey', []);
        expect(result).toEqual(largeArray);
        expect(result).toHaveLength(1000);
      });

      it('should handle special characters in keys', () => {
        const testData = { value: 'test' };
        localStorage.setItem('test.key-with_special@chars', JSON.stringify(testData));

        const result = loadFromStorage('test.key-with_special@chars', null);
        expect(result).toEqual(testData);
      });
    });
  });

  describe('saveToStorage', () => {
    describe('happy path', () => {
      it('should save object to localStorage', () => {
        const testData = { name: 'test', value: 123 };
        saveToStorage('testKey', testData);

        const stored = localStorage.getItem('testKey');
        expect(stored).toBe(JSON.stringify(testData));
      });

      it('should save string values', () => {
        saveToStorage('testKey', 'simple string');

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBe('simple string');
      });

      it('should save number values', () => {
        saveToStorage('testKey', 42);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBe(42);
      });

      it('should save boolean values', () => {
        saveToStorage('testKey', true);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBe(true);
      });

      it('should save array values', () => {
        const testArray = [1, 2, 3, 'four'];
        saveToStorage('testKey', testArray);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toEqual(testArray);
      });

      it('should save nested object structures', () => {
        const complexData = {
          user: {
            id: '123',
            profile: {
              name: 'John',
              age: 30,
            },
          },
        };
        saveToStorage('testKey', complexData);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toEqual(complexData);
      });

      it('should overwrite existing values', () => {
        saveToStorage('testKey', 'first value');
        saveToStorage('testKey', 'second value');

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBe('second value');
      });
    });

    describe('special values', () => {
      it('should save null values', () => {
        saveToStorage('testKey', null);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBeNull();
      });

      it('should save undefined as null', () => {
        saveToStorage('testKey', undefined);

        const stored = localStorage.getItem('testKey');
        expect(stored).toBe('null');
      });

      it('should save empty object', () => {
        saveToStorage('testKey', {});

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toEqual({});
      });

      it('should save empty array', () => {
        saveToStorage('testKey', []);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toEqual([]);
      });

      it('should save zero', () => {
        saveToStorage('testKey', 0);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBe(0);
      });

      it('should save empty string', () => {
        saveToStorage('testKey', '');

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBe('');
      });
    });

    describe('error handling', () => {
      it('should handle localStorage errors gracefully', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('Storage quota exceeded');
        });

        saveToStorage('testKey', { data: 'test' });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to save data:',
          expect.any(Error)
        );

        setItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });

      it('should not throw when saving fails', () => {
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('Storage error');
        });
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => saveToStorage('testKey', 'data')).not.toThrow();

        setItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });
    });

    describe('edge cases', () => {
      it('should handle very large data', () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          data: `item-${i}`,
        }));

        saveToStorage('testKey', largeArray);

        const stored = localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toEqual(largeArray);
      });

      it('should handle special characters in keys', () => {
        const testData = { value: 'test' };
        saveToStorage('test.key-with_special@chars', testData);

        const stored = localStorage.getItem('test.key-with_special@chars');
        expect(JSON.parse(stored)).toEqual(testData);
      });

      it('should handle circular references gracefully', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const circularObj: any = { name: 'test' };
        circularObj.self = circularObj;

        saveToStorage('testKey', circularObj);

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
      });

      it('should handle Date objects', () => {
        const date = new Date('2024-01-01T00:00:00.000Z');
        saveToStorage('testKey', date);

        const stored = localStorage.getItem('testKey');
        expect(stored).toBe(JSON.stringify(date));
      });
    });
  });

  describe('integration between load and save', () => {
    it('should retrieve exactly what was saved', () => {
      const testData = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      saveToStorage('testKey', testData);
      const loaded = loadFromStorage('testKey', null);

      expect(loaded).toEqual(testData);
    });

    it('should handle multiple keys independently', () => {
      saveToStorage('key1', 'value1');
      saveToStorage('key2', 'value2');
      saveToStorage('key3', 'value3');

      expect(loadFromStorage('key1', null)).toBe('value1');
      expect(loadFromStorage('key2', null)).toBe('value2');
      expect(loadFromStorage('key3', null)).toBe('value3');
    });

    it('should update values correctly', () => {
      saveToStorage('counter', 0);
      expect(loadFromStorage('counter', null)).toBe(0);

      saveToStorage('counter', 1);
      expect(loadFromStorage('counter', null)).toBe(1);

      saveToStorage('counter', 2);
      expect(loadFromStorage('counter', null)).toBe(2);
    });
  });
});