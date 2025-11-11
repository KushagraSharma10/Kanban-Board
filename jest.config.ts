import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/js-with-ts-esm',

  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.app.json',
        // speed + fewer surprises
        isolatedModules: true,
      },
    ],
  },

  verbose: true,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
