import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/src"],
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/backend/**/*.ts",
    "!**/node_modules/**",
    "!<rootDir>/src/**/tests/**",
    "!<rootDir>/src/**/__tests__/**",
    "!<rootDir>/src/**/*.test.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/backend/domain/**/*.ts",
    "<rootDir>/src/backend/domain/errors/*.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["json", "lcov", "text", "clover", "json-summary"],
  maxWorkers: "25%",
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  passWithNoTests: true,
  preset: "ts-jest",
  resetMocks: true,
  silent: true,
  testEnvironment: "node",
};

export default config;
