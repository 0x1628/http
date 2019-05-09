module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'whatwg-fetch': '<rootDir>/src/fake'
  },
}