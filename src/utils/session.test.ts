import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSession, createSession } from './session';
import { SESSION_STORAGE_KEY } from './constants/session';
import type { SessionData } from './types/session';

describe('session utilities', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    describe('happy path', () => {
      it('should retrieve valid session data', () => {
        const sessionData: SessionData = {
          userId: 'user-123',
          createdAt: Date.now(),
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

        const result = getSession();
        expect(result).toEqual(sessionData);
      });

      it('should retrieve session with all properties', () => {
        const sessionData: SessionData = {
          userId: 'user-abc-xyz',
          createdAt: 1234567890,
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

        const result = getSession();
        expect(result?.userId).toBe('user-abc-xyz');
        expect(result?.createdAt).toBe(1234567890);
      });

      it('should handle multiple session retrievals', () => {
        const sessionData: SessionData = {
          userId: 'user-123',
          createdAt: Date.now(),
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

        const result1 = getSession();
        const result2 = getSession();
        const result3 = getSession();

        expect(result1).toEqual(sessionData);
        expect(result2).toEqual(sessionData);
        expect(result3).toEqual(sessionData);
      });
    });

    describe('no session exists', () => {
      it('should return null when no session exists', () => {
        const result = getSession();
        expect(result).toBeNull();
      });

      it('should return null when session storage is empty', () => {
        sessionStorage.clear();
        const result = getSession();
        expect(result).toBeNull();
      });
    });

    describe('error handling', () => {
      it('should return null when JSON parse fails', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'invalid json {');

        const result = getSession();

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to retrieve session from sessionStorage:',
          expect.any(Error)
        );
        consoleErrorSpy.mockRestore();
      });

      it('should handle corrupted session data', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        sessionStorage.setItem(SESSION_STORAGE_KEY, '{broken: json}');

        const result = getSession();

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
      });

      it('should handle sessionStorage access errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
          throw new Error('Session storage error');
        });

        const result = getSession();

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();

        getItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });

      it('should not throw when retrieval fails', () => {
        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
          throw new Error('Access denied');
        });
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => getSession()).not.toThrow();

        getItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });
    });

    describe('edge cases', () => {
      it('should handle empty string in session storage', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        sessionStorage.setItem(SESSION_STORAGE_KEY, '');

        const result = getSession();
        expect(result).toBeNull();

        consoleErrorSpy.mockRestore();
      });

      it('should handle null string in session storage', () => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(null));

        const result = getSession();
        expect(result).toBeNull();
      });

      it('should handle session with additional properties', () => {
        const sessionData = {
          userId: 'user-123',
          createdAt: Date.now(),
          extraProp: 'extra',
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

        const result = getSession();
        expect(result).toEqual(sessionData);
      });

      it('should handle session with missing properties', () => {
        const incompleteSession = { userId: 'user-123' };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(incompleteSession));

        const result = getSession();
        expect(result).toEqual(incompleteSession);
      });
    });
  });

  describe('createSession', () => {
    describe('happy path', () => {
      it('should create session with userId', () => {
        createSession('user-123');

        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        expect(stored).toBeDefined();
        const parsed = JSON.parse(stored!);
        expect(parsed.userId).toBe('user-123');
        expect(parsed.createdAt).toBeDefined();
        expect(typeof parsed.createdAt).toBe('number');
      });

      it('should create session with timestamp', () => {
        const beforeTime = Date.now();
        createSession('user-abc');
        const afterTime = Date.now();

        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        const parsed = JSON.parse(stored!);

        expect(parsed.createdAt).toBeGreaterThanOrEqual(beforeTime);
        expect(parsed.createdAt).toBeLessThanOrEqual(afterTime);
      });

      it('should overwrite existing session', () => {
        createSession('user-first');
        const firstSession = getSession();

        createSession('user-second');
        const secondSession = getSession();

        expect(firstSession?.userId).toBe('user-first');
        expect(secondSession?.userId).toBe('user-second');
        expect(secondSession?.userId).not.toBe(firstSession?.userId);
      });

      it('should create session with special characters in userId', () => {
        const specialUserId = 'user-123-abc_def@example.com';
        createSession(specialUserId);

        const result = getSession();
        expect(result?.userId).toBe(specialUserId);
      });

      it('should create session with very long userId', () => {
        const longUserId = 'user-' + 'a'.repeat(100);
        createSession(longUserId);

        const result = getSession();
        expect(result?.userId).toBe(longUserId);
      });
    });

    describe('edge cases', () => {
      it('should handle empty userId', () => {
        createSession('');

        const result = getSession();
        expect(result?.userId).toBe('');
        expect(result?.createdAt).toBeDefined();
      });

      it('should handle userId with whitespace', () => {
        createSession('  user-123  ');

        const result = getSession();
        expect(result?.userId).toBe('  user-123  ');
      });

      it('should handle numeric userId as string', () => {
        createSession('12345');

        const result = getSession();
        expect(result?.userId).toBe('12345');
      });

      it('should handle userId with special characters', () => {
        const specialIds = [
          'user@example.com',
          'user-name_123',
          'user.name+tag',
          'user/path/123',
        ];

        specialIds.forEach(id => {
          createSession(id);
          const result = getSession();
          expect(result?.userId).toBe(id);
        });
      });

      it('should create sessions with different timestamps', () => {
        createSession('user-1');
        const session1 = getSession();

        // Small delay to ensure different timestamp
        vi.advanceTimersByTime(10);

        createSession('user-2');
        const session2 = getSession();

        expect(session1?.createdAt).toBeDefined();
        expect(session2?.createdAt).toBeDefined();
      });
    });

    describe('error handling', () => {
      it('should handle sessionStorage errors gracefully', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('Session storage quota exceeded');
        });

        createSession('user-123');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to create session in sessionStorage:',
          expect.any(Error)
        );

        setItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });

      it('should not throw when creation fails', () => {
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('Storage error');
        });
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => createSession('user-123')).not.toThrow();

        setItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });

      it('should handle JSON stringify errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const stringifySpy = vi.spyOn(JSON, 'stringify').mockImplementation(() => {
          throw new Error('Stringify error');
        });

        createSession('user-123');

        expect(consoleErrorSpy).toHaveBeenCalled();

        stringifySpy.mockRestore();
        consoleErrorSpy.mockRestore();
      });
    });

    describe('integration between createSession and getSession', () => {
      it('should retrieve session immediately after creation', () => {
        const userId = 'user-integration-test';
        createSession(userId);

        const retrieved = getSession();
        expect(retrieved?.userId).toBe(userId);
        expect(retrieved?.createdAt).toBeDefined();
      });

      it('should handle multiple create and retrieve cycles', () => {
        const userIds = ['user-1', 'user-2', 'user-3'];

        userIds.forEach(userId => {
          createSession(userId);
          const retrieved = getSession();
          expect(retrieved?.userId).toBe(userId);
        });
      });

      it('should maintain session across multiple retrievals', () => {
        createSession('persistent-user');

        const retrieve1 = getSession();
        const retrieve2 = getSession();
        const retrieve3 = getSession();

        expect(retrieve1).toEqual(retrieve2);
        expect(retrieve2).toEqual(retrieve3);
      });

      it('should update session when created again', () => {
        createSession('user-first');
        const firstRetrieve = getSession();

        createSession('user-second');
        const secondRetrieve = getSession();

        expect(firstRetrieve?.userId).not.toBe(secondRetrieve?.userId);
        expect(secondRetrieve?.userId).toBe('user-second');
      });
    });
  });
});