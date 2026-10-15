// Jest 30 needs ts-node to load TypeScript config files, so the config
// stays plain CJS (the canonical Next.js form) while tests/setup remain TS.
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

module.exports = createJestConfig(customJestConfig);
