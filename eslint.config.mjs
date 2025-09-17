import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import stylisticTS from "@stylistic/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  }),
  {
    plugins: {
      "@stylistic/ts": stylisticTS,
    },
    rules: {
      "no-multi-spaces": ["error"],
      "no-trailing-spaces": "error",
      "no-unused-vars": "error",
      "no-extra-parens": "error",
      "max-len": ["error", { code: 150 }],
      "@stylistic/ts/semi": "error",
      "@stylistic/ts/indent": ["error", 2],
      "@stylistic/ts/no-console": "off",
      "@stylistic/ts/object-curly-spacing": [
        "error",
        "always",
        { objectsInObjects: false },
      ],
    },
  },
];

export default eslintConfig;
