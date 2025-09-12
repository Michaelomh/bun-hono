import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

import type { Env } from '@/types';

import { auth } from '@/lib/auth';
import { authMiddleware } from '@/middleware/auth';
import { customLogger } from '@/middleware/logger';
import defaultHook from '@/utils/default-hook';
import * as HttpStatusCode from '@/utils/http-status-codes';

export function createRouter() {
  return new OpenAPIHono<Env>(
    { strict: false, defaultHook },
  );
}

export function createApp() {
  const app = createRouter();

  app.use('/api/*', cors())
    .use(
      '/api/auth/*', // or replace with "*" to enable cors for all routes
      cors({
        origin: 'http://localhost:8787', // replace with your origin
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
      }),
    )
    .use(logger(customLogger))
    .use(requestId())
    .use(authMiddleware());

  app.on(['POST', 'GET'], '/api/auth/*', c => auth(c).handler(c.req.raw));

  app.notFound((c) => {
    return c.json({
      message: `Not found - ${c.req.path}`,
    }, HttpStatusCode.NOT_FOUND);
  });

  return app;
}
