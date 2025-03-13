import type { Config } from "jest";

const config: Config = {
  collectCoverage: false,
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "<rootDir>/src/backend/**/*.ts",
    "!**/node_modules/**",
    "!<rootDir>/src/**/tests/**",
    "!<rootDir>/src/**/__tests__/**",
    "!<rootDir>/src/**/*.test.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/backend/domain/**/*.ts",
    "!<rootDir>/src/backend/presentation/protocols/*.ts",
    "<rootDir>/src/backend/domain/errors/*.ts",
  ],
  coverageReporters: ["json", "lcov", "text", "clover", "json-summary"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  maxWorkers: "25%",
  passWithNoTests: true,
  clearMocks: true,
  resetMocks: true,
};

export default config;
