const path = require("path");

process.env.NODE_ENV = "test";

module.exports = {
  rootDir: path.resolve(__dirname),
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  collectCoverage: false,
  coverageReporters: ["html", "text-summary", "lcov"],
  coverageDirectory: "<rootDir>/test/unit/coverage",
  collectCoverageFrom: ["src/**/*.{ts, js}"]
};
