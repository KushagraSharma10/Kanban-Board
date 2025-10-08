import { describe, it, expect, beforeEach } from 'vitest';
import { getActiveUser, getAllUsers } from './auth';
import { USERS_STORAGE_KEY } from './constants/auth';
import { SESSION_STORAGE_KEY } from './constants/session';
import type { UserData } from './interface/user-data';
import type { SessionData } from './types/session';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('getAllUsers', () => {
    describe('happy path', () => {
      it('should return all users from storage', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed-password-1',
            role: 'admin',
          },
          {
            id: 'user-2',
            name: 'Bob',
            email: 'bob@example.com',
            password: 'hashed-password-2',
            role: 'member',
          },
        ];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        const result = getAllUsers();
        expect(result).toEqual(users);
        expect(result).toHaveLength(2);
      });

      it('should return empty array when no users exist', () => {
        const result = getAllUsers();
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });

      it('should return array with single user', () => {
        const user: UserData = {
          id: 'user-1',
          name: 'Alice',
          email: 'alice@example.com',
          password: 'hashed',
          role: 'admin',
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([user]));

        const result = getAllUsers();
        expect(result).toEqual([user]);
        expect(result).toHaveLength(1);
      });

      it('should return array with many users', () => {
        const users: UserData[] = Array.from({ length: 10 }, (_, i) => ({
          id: `user-${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: `hashed-${i}`,
          role: i % 2 === 0 ? 'admin' as const : 'member' as const,
        }));
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        const result = getAllUsers();
        expect(result).toEqual(users);
        expect(result).toHaveLength(10);
      });
    });

    describe('invalid data handling', () => {
      it('should return empty array when storage contains non-array', () => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify({ notArray: true }));

        const result = getAllUsers();
        expect(result).toEqual([]);
      });

      it('should return empty array when storage contains string', () => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify('not an array'));

        const result = getAllUsers();
        expect(result).toEqual([]);
      });

      it('should return empty array when storage contains number', () => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(123));

        const result = getAllUsers();
        expect(result).toEqual([]);
      });

      it('should return empty array when storage contains null', () => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(null));

        const result = getAllUsers();
        expect(result).toEqual([]);
      });

      it('should return empty array when storage contains invalid JSON', () => {
        localStorage.setItem(USERS_STORAGE_KEY, 'invalid json {');

        const result = getAllUsers();
        expect(result).toEqual([]);
      });
    });

    describe('edge cases', () => {
      it('should handle users with all roles', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'hash1',
            role: 'admin',
          },
          {
            id: 'user-2',
            name: 'Member User',
            email: 'member@example.com',
            password: 'hash2',
            role: 'member',
          },
        ];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        const result = getAllUsers();
        expect(result).toEqual(users);
        expect(result[0].role).toBe('admin');
        expect(result[1].role).toBe('member');
      });

      it('should preserve user data structure', () => {
        const user: UserData = {
          id: 'user-abc-123',
          name: 'Test User',
          email: 'test@example.com',
          password: 'very-long-hashed-password-string',
          role: 'admin',
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([user]));

        const result = getAllUsers();
        expect(result[0]).toEqual(user);
        expect(result[0].id).toBe(user.id);
        expect(result[0].name).toBe(user.name);
        expect(result[0].email).toBe(user.email);
        expect(result[0].password).toBe(user.password);
        expect(result[0].role).toBe(user.role);
      });

      it('should handle users with special characters in fields', () => {
        const user: UserData = {
          id: 'user-\!@#$%',
          name: "O'Brien-Smith",
          email: 'user+tag@example.co.uk',
          password: 'hash\!@#$%^&*()',
          role: 'admin',
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([user]));

        const result = getAllUsers();
        expect(result[0]).toEqual(user);
      });
    });
  });

  describe('getActiveUser', () => {
    describe('happy path', () => {
      it('should return active user when session and user exist', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
          {
            id: 'user-2',
            name: 'Bob',
            email: 'bob@example.com',
            password: 'hashed',
            role: 'member',
          },
        ];
        const session: SessionData = {
          userId: 'user-1',
          createdAt: Date.now(),
        };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result).toEqual(users[0]);
        expect(result?.id).toBe('user-1');
        expect(result?.name).toBe('Alice');
      });

      it('should return correct user from multiple users', () => {
        const users: UserData[] = Array.from({ length: 5 }, (_, i) => ({
          id: `user-${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: 'hashed',
          role: 'member' as const,
        }));
        const session: SessionData = {
          userId: 'user-3',
          createdAt: Date.now(),
        };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result?.id).toBe('user-3');
        expect(result?.name).toBe('User 3');
      });

      it('should return user with all properties intact', () => {
        const user: UserData = {
          id: 'user-complete',
          name: 'Complete User',
          email: 'complete@example.com',
          password: 'very-secure-hash',
          role: 'admin',
        };
        const session: SessionData = {
          userId: 'user-complete',
          createdAt: 1234567890,
        };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([user]));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result).toEqual(user);
      });
    });

    describe('no active user scenarios', () => {
      it('should return null when no session exists', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
        ];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        const result = getActiveUser();
        expect(result).toBeNull();
      });

      it('should return null when session has no userId', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
        ];
        const session = { userId: '', createdAt: Date.now() };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result).toBeNull();
      });

      it('should return null when user does not exist', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
        ];
        const session: SessionData = {
          userId: 'non-existent-user',
          createdAt: Date.now(),
        };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result).toBeNull();
      });

      it('should return null when no users exist', () => {
        const session: SessionData = {
          userId: 'user-1',
          createdAt: Date.now(),
        };

        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result).toBeNull();
      });

      it('should return null when session is invalid JSON', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
        ];

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'invalid json');

        const result = getActiveUser();
        expect(result).toBeNull();
      });
    });

    describe('edge cases', () => {
      it('should handle session with null userId', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
        ];
        const session = { userId: null, createdAt: Date.now() };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result).toBeNull();
      });

      it('should handle session with undefined userId', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
        ];
        const session = { createdAt: Date.now() };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result).toBeNull();
      });

      it('should match userId exactly', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed',
            role: 'admin',
          },
          {
            id: 'user-10',
            name: 'Bob',
            email: 'bob@example.com',
            password: 'hashed',
            role: 'member',
          },
        ];
        const session: SessionData = {
          userId: 'user-1',
          createdAt: Date.now(),
        };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result?.id).toBe('user-1');
        expect(result?.name).toBe('Alice');
      });

      it('should return first matching user if duplicates exist', () => {
        const users: UserData[] = [
          {
            id: 'user-1',
            name: 'First Alice',
            email: 'alice1@example.com',
            password: 'hashed',
            role: 'admin',
          },
          {
            id: 'user-1',
            name: 'Second Alice',
            email: 'alice2@example.com',
            password: 'hashed',
            role: 'member',
          },
        ];
        const session: SessionData = {
          userId: 'user-1',
          createdAt: Date.now(),
        };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        const result = getActiveUser();
        expect(result?.name).toBe('First Alice');
      });
    });
  });

  describe('integration tests', () => {
    it('should handle complete auth flow', () => {
      // Setup users
      const users: UserData[] = [
        {
          id: 'user-1',
          name: 'Alice',
          email: 'alice@example.com',
          password: 'hashed',
          role: 'admin',
        },
        {
          id: 'user-2',
          name: 'Bob',
          email: 'bob@example.com',
          password: 'hashed',
          role: 'member',
        },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Verify all users
      const allUsers = getAllUsers();
      expect(allUsers).toHaveLength(2);

      // No active user initially
      expect(getActiveUser()).toBeNull();

      // Create session for user-1
      const session1: SessionData = {
        userId: 'user-1',
        createdAt: Date.now(),
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session1));
      expect(getActiveUser()?.name).toBe('Alice');

      // Switch to user-2
      const session2: SessionData = {
        userId: 'user-2',
        createdAt: Date.now(),
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session2));
      expect(getActiveUser()?.name).toBe('Bob');

      // Clear session
      sessionStorage.clear();
      expect(getActiveUser()).toBeNull();
    });
  });
});