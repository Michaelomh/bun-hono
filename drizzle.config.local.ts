import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/1f652a766566cba970c24a451990d5aeb7f3310861134f57f52002e48d0ad3c6.sqlite",
  },
});
