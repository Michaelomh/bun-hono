import type { Context } from 'hono';

import { drizzle } from 'drizzle-orm/d1';

import type { Env } from '@/types';

import * as schema from '@/db/schema';

export function dbInstance(c: Context<{ Bindings: Env }>) {
  return drizzle(c.env.DB, { schema });
}
