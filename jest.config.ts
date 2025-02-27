import type { Config } from "jest";

const config: Config = {
  collectCoverage: false,
  roots: ["<rootDir>/src"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  passWithNoTests: true,
  noStackTrace: true,
  maxWorkers: 1,
};

export default config;
