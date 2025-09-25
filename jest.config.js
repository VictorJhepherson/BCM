/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  roots: [
    '<rootDir>/apps',
    '<rootDir>/packages',
  ],
  moduleNameMapper: {
    '^@shared/core(.*)$': '<rootDir>/../../packages/core/src$1',
    '^@shared/testing(.*)$': '<rootDir>/../../packages/testing/src$1',
  },
  testMatch: [
    '**/?(*).test.+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    '!**/*.d.ts',
    '!**/main.ts',
    '!**/index.ts',
    '!**/*.module.ts',
  ],
  testPathIgnorePatterns: [
    'index\\.ts$',
    '\\.dtos\\.ts$',
    '\\.mocks\\.ts$',
    '\\.types\\.ts$',
    '\\.schemas\\.ts$',
    '\\.messages\\.ts$',
    '\\.constants\\.ts$',
    '\\.interfaces\\.ts$',
    '<rootDir>/packages/models/',
    '<rootDir>/packages/testing/'
  ],
};
