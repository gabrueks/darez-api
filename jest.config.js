// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,

  coverageDirectory: 'coverage',

  coveragePathIgnorePatterns: [
    '/node_modules/',
    'bin/**.js',
  ],

  coverageProvider: 'v8',

  coverageReporters: [
    'json',
    'text',
    'lcov',
  ],

  roots: [
    '<rootDir>/darez-api',
  ],

  testEnvironment: 'jsdom',

  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
