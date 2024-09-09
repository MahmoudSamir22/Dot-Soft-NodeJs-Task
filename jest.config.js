module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["**/*.test.ts"], // Match test files with `.test.ts` extension
  collectCoverage: true,
  coverageDirectory: "coverage",
  verbose: true,
};
