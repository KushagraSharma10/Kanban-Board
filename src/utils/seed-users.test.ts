import { describe, it, expect, beforeEach, vi } from 'vitest';
import { seedInitialUsers } from './seed-users';
import { USERS_STORAGE_KEY } from './constants/auth';
import type { UserData } from './interface/user-data';

describe('seedInitialUsers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('happy path', () => {
    it('should seed users when storage is empty', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      expect(stored).not.toBeNull();

      const users = JSON.parse(stored as string) as UserData[];
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should create users with required properties', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('password');
        expect(user).toHaveProperty('role');
      });
    });

    it('should create users with valid id', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.id).toBeDefined();
        expect(typeof user.id).toBe('string');
        expect(user.id.length).toBeGreaterThan(0);
      });
    });

    it('should create users with valid names', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.name).toBeDefined();
        expect(typeof user.name).toBe('string');
        expect(user.name.length).toBeGreaterThan(0);
      });
    });

    it('should create users with valid emails', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.email).toBeDefined();
        expect(typeof user.email).toBe('string');
        expect(user.email).toMatch(/@/);
      });
    });

    it('should create users with hashed passwords', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.password).toBeDefined();
        expect(typeof user.password).toBe('string');
        expect(user.password.length).toBeGreaterThan(10); // bcrypt hashes are long
      });
    });

    it('should create users with valid roles', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.role).toBeDefined();
        expect(['admin', 'member']).toContain(user.role);
      });
    });

    it('should create multiple seed users', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('preventing duplicate seeding', () => {
    it('should not seed when users already exist', () => {
      const existingUsers: UserData[] = [
        {
          id: 'existing-user',
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'hashed-password',
          role: 'admin',
        },
      ];

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));

      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users).toEqual(existingUsers);
      expect(users.length).toBe(1);
      expect(users[0].id).toBe('existing-user');
    });

    it('should not overwrite existing users', () => {
      const existingUsers: UserData[] = [
        {
          id: 'user-1',
          name: 'User One',
          email: 'user1@example.com',
          password: 'pass1',
          role: 'admin',
        },
        {
          id: 'user-2',
          name: 'User Two',
          email: 'user2@example.com',
          password: 'pass2',
          role: 'member',
        },
      ];

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));

      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users).toEqual(existingUsers);
      expect(users.length).toBe(2);
    });

    it('should be idempotent', () => {
      seedInitialUsers();
      const firstSeed = localStorage.getItem(USERS_STORAGE_KEY);

      seedInitialUsers();
      const secondSeed = localStorage.getItem(USERS_STORAGE_KEY);

      expect(firstSeed).toBe(secondSeed);
    });

    it('should check for empty array before seeding', () => {
      // Empty array should trigger seeding
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));

      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle corrupted storage data', () => {
      localStorage.setItem(USERS_STORAGE_KEY, 'invalid json {');

      // Should seed new users despite corrupted data
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users.length).toBeGreaterThan(0);
    });

    it('should handle null in storage', () => {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(null));

      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users.length).toBeGreaterThan(0);
    });

    it('should handle non-array data in storage', () => {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify({ notArray: true }));

      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('seed data integrity', () => {
    it('should create unique user ids', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      const ids = users.map(u => u.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should create unique emails', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      const emails = users.map(u => u.email);
      const uniqueEmails = new Set(emails);

      expect(uniqueEmails.size).toBe(emails.length);
    });

    it('should not have empty names', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.name.trim().length).toBeGreaterThan(0);
      });
    });

    it('should not have empty emails', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.email.trim().length).toBeGreaterThan(0);
      });
    });

    it('should not have empty passwords', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      users.forEach(user => {
        expect(user.password.length).toBeGreaterThan(0);
      });
    });
  });

  describe('integration with storage', () => {
    it('should properly serialize users to localStorage', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      expect(stored).not.toBeNull();

      // Should be valid JSON
      expect(() => JSON.parse(stored as string)).not.toThrow();

      // Should be an array
      const parsed = JSON.parse(stored as string);
      expect(Array.isArray(parsed)).toBe(true);
    });

    it('should be retrievable after seeding', () => {
      seedInitialUsers();

      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users = JSON.parse(stored as string) as UserData[];

      expect(users).toBeDefined();
      expect(users.length).toBeGreaterThan(0);

      // Verify structure is intact
      users.forEach(user => {
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.password).toBeDefined();
        expect(user.role).toBeDefined();
      });
    });
  });

  describe('multiple executions', () => {
    it('should produce consistent results on first run', () => {
      seedInitialUsers();
      const firstRun = localStorage.getItem(USERS_STORAGE_KEY);

      localStorage.clear();

      seedInitialUsers();
      const secondRun = localStorage.getItem(USERS_STORAGE_KEY);

      // User count should be same
      const firstUsers = JSON.parse(firstRun as string) as UserData[];
      const secondUsers = JSON.parse(secondRun as string) as UserData[];
      expect(firstUsers.length).toBe(secondUsers.length);
    });

    it('should not modify storage on subsequent calls', () => {
      seedInitialUsers();
      const initialState = localStorage.getItem(USERS_STORAGE_KEY);

      seedInitialUsers();
      seedInitialUsers();
      seedInitialUsers();

      const finalState = localStorage.getItem(USERS_STORAGE_KEY);
      expect(finalState).toBe(initialState);
    });
  });
});