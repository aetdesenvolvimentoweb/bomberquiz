import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    plugins: ["react-hooks", "@next/next", "simple-import-sort", "prettier"],
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      "prettier/prettier": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  }),
];

export default eslintConfig;
