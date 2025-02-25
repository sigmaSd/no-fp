import tseslint from "npm:typescript-eslint";
import tsParser from "npm:@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    ignores: ["**/node_modules/**"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "warn",
    },
  },
];
