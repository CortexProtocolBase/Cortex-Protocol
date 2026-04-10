import type { Config } from "jest";
const config: Config = { preset: "ts-jest", testEnvironment: "jsdom", moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" }, setupFilesAfterSetup: ["<rootDir>/jest.setup.ts"], transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }] }, testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"] };
export default config;
