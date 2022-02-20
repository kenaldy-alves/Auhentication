module.exports = {
  rootDir: "./",
  preset: "ts-jest",
  testEnvironment: "node",
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!<rootDir>/src/security/**/*.{ts,js}",
    "!<rootDir>/src/errors/**/*.{ts,js}",
    "!<rootDir>/src/endpoints/**/*.{ts,js}",
    "!<rootDir>/src/clients/**/*.{ts,js}",
    "!<rootDir>/src/config/**/*.{ts,js}",
    "!<rootDir>/src/services/permissionService.ts", // @TODO corrigir o teste e remover esta linha
  ],
};
