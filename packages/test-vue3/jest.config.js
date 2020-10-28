const path = require("path");

process.env.NODE_ENV = "test";

module.exports = {
  rootDir: path.resolve(__dirname),
  roots: ["<rootDir>"],
  moduleFileExtensions: ["js", "jsx", "json"],
  moduleNameMapper: {
  },
  testRegex: "(/test/.*|(\\.|/)(test|spec))\\.js?$",
  transform: {
  },
};
