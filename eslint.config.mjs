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
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      'react/no-unescaped-entities': 'off',
      'semi': 'error',
      'indent': ['error', 2],
      'no-multi-spaces': ['error'],
      "no-trailing-spaces": "error",
      "no-console": "off",
      "no-unused-vars": "error",
      "no-extra-parens": "error",

      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
          "message": "Unexpected property on console object was called"
        }
      ]
    },
  }),
];

export default eslintConfig;
