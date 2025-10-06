import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/__tests__"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.[jt]s?(x)", "**/*.spec.[jt]s?(x)"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/jest.config.ts",
    "<rootDir>/jest.setup.ts",
    "<rootDir>/coverage/",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  verbose: true,
  detectOpenHandles: true,
};

export default config;
