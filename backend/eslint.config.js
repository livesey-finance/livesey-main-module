import js from "@eslint/js";
import google from "eslint-config-google";
import prettier from "eslint-config-prettier";

// Об'єднуємо правила Google і Prettier, щоб використовувати їх без extends
const combinedRules = {
  ...google.rules,
  "require-jsdoc": "off",
  "valid-jsdoc": "off",
  "quotes": ["error", "double"],
  "indent": ["error", 2],
  "max-len": ["error", { code: 100 }],
  ...prettier.rules, // Додаємо правила Prettier, щоб уникнути конфліктів
};

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
        console: "readonly", // DELETE THIS IN THE FUTURE
        process: "readonly",
      },
    },
    rules: combinedRules,
  },
];
