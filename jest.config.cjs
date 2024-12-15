module.exports = {
    preset: 'ts-jest', // Use ts-jest preset
    testEnvironment: 'jsdom', // For DOM-related tests
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testEnvironment: "jest-environment-jsdom",
  };
  