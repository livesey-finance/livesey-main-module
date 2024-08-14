import js from "@eslint/js";
import google from "eslint-config-google";

export default [
  {
    ...js.configs.recommended,
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      ...google.rules,
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "max-len": ["error", {code: 100}],
    },
  },
];
