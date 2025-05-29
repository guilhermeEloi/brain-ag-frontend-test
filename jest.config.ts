import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.jest.json",
    },
  },
};

export default config;
