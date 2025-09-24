import type { Context } from 'hono';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { drizzle } from 'drizzle-orm/d1';

import type { Env } from '@/types';

import * as schema from '@/db/schema';

const TOKEN_EXPIRY_TIME_SECONDS = 60 * 60 * 24;
const COOKIE_CACHE_SECONDS = 5 * 60;

export function auth(c: Context<Env>): ReturnType<typeof betterAuth> {
  return betterAuth({
    session: {
      expiresIn: TOKEN_EXPIRY_TIME_SECONDS,
      cookieCache: {
        enabled: true,
        maxAge: COOKIE_CACHE_SECONDS,
      },
    },
    database: drizzleAdapter(drizzle(c.env.DB, { schema, casing: 'snake_case' }), {
      provider: 'sqlite',
    }),
    appName: 'bun-hono',
    plugins: [openAPI()],
    user: {
      additionalFields: {
        role: { type: 'string', input: false },
      },
    },
    emailAndPassword: { enabled: true },
    socialProviders: {
      google: {
        prompt: 'select_account',
        clientId: c.env.GOOGLE_CLIENT_ID as string,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    trustedOrigins: [c.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:8787'],
  });
}
