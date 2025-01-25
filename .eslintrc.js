module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "unused-imports",
    "tailwindcss",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "unused-imports/no-unused-imports": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-non-null-assertion": "error",
    "tailwindcss/classnames-order": "error",
    "tailwindcss/no-custom-classname": "error",
  },
  settings: {
    tailwindcss: {
      callees: ["cn", "clsx", "twMerge"],
      config: "tailwind.config.js",
    },
    next: {
      rootDir: ["apps/*/"],
    },
  },
}; 