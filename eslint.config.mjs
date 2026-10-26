import { defineConfig, globalIgnores } from "eslint/config"
import next from "eslint-config-next/core-web-vitals"
import typescript from "eslint-config-next/typescript"

export default defineConfig([
  ...next,
  ...typescript,
  { rules: { "react-hooks/set-state-in-effect": "off" } },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    ".wrangler/**",
    "next-env.d.ts",
    "client/**",
    "server/**",
  ]),
])
