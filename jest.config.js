module.exports = {
  // Set the test environment
  testEnvironment: 'node',

  // Files to test
  testMatch: [
    '**/*test.js',
    '__test__/*.tests.js'
  ],

  // Configure coverage collection
  collectCoverage: true,

  // Location to output coverage reports
  coverageDirectory: 'coverage',

  // Files to include in coverage analysis
  collectCoverageFrom: [
    'export/label-generator.mjs',
    'src/index.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],

  // Coverage reporters to use
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage thresholds to enforce
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Display individual test results
  verbose: true,

  // Custom reporters
  reporters: ['default']
};