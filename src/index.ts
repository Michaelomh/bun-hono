import type { D1Database } from "@cloudflare/workers-types";

import { OpenAPIHono } from "@hono/zod-openapi";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { logger } from "hono/logger";

import { posts } from "./db/schema";
import { NOT_FOUND } from "./utils/http-status-code";

// set env variables
export interface Env {
  WRANGLER_VAR: string;
  LOCAL_VAR: string;
  bun_hono_d1: D1Database;
}

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: false });
app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/posts", async (c) => {
  const db = drizzle(c.env.bun_hono_d1);
  const results = await db.select().from(posts).all();
  return c.json(results);
});

app.get("/env", (c) => {
  return c.text(`Variable from Wrangler.jsonc: ${c.env.WRANGLER_VAR}
Variable from .dev.vars: ${c.env.LOCAL_VAR}`);
});

// not found
app.notFound((c) => {
  return c.json({
    message: `Not found - ${c.req.path}`,
  }, NOT_FOUND);
});

// TODO: add one to catch all errors.
export default app;
