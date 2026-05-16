import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "server-only" is a Next.js sentinel that throws on client imports.
      // In a test environment it's harmless and we want to be able to
      // import server modules directly.
      "server-only": fileURLToPath(new URL("./tests/_shims/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
