# Utility Functions Test Suite

This directory contains comprehensive unit tests for all utility functions in the application.

## Test Files

### Storage & Session Management
- **storage.test.ts** - Tests for localStorage utilities (`loadFromStorage`, `saveToStorage`)
- **session.test.ts** - Tests for sessionStorage utilities (`getSession`, `createSession`)
- **auth.test.ts** - Tests for authentication utilities (`getActiveUser`, `getAllUsers`)
- **seed-users.test.ts** - Tests for user seeding functionality

### Validation
- **validation.test.ts** - Tests for input validation functions:
  - Password validation (length, uppercase, lowercase, digits, special chars)
  - Email validation
  - Email normalization

### Board & Column Management
- **boards.test.ts** - Tests for board name normalization
- **order-storage.test.ts** - Tests for board column ordering functionality

### Drag & Drop
- **drag-and-drop.test.ts** - Tests for drag-and-drop utilities:
  - Setting and getting drag data
  - Moving items within lists
  - Reordering items by ID

## Test Coverage

Each test file follows a consistent structure:
1. **Happy Path** - Normal, expected usage scenarios
2. **Edge Cases** - Boundary conditions and unusual inputs
3. **Error Handling** - Invalid inputs and error recovery
4. **Integration** - Cross-function interactions

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Statistics

- **Total Test Files**: 8
- **Test Categories**:
  - Storage/Session: 3 files
  - Validation: 1 file
  - Board Management: 2 files
  - Drag & Drop: 1 file
  - User Management: 1 file

## Key Testing Patterns

1. **Isolation**: Each test is independent and cleans up after itself
2. **Mocking**: External dependencies are mocked using Vitest
3. **Comprehensive**: Tests cover happy paths, edge cases, and error conditions
4. **Descriptive**: Test names clearly describe what is being tested
5. **Maintainable**: Tests follow consistent structure and naming conventions