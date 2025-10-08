import { afterEach } from 'vitest';

// Clear storage after each test
afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});