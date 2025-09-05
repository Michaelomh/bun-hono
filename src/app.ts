import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

import { customLogger } from '@/middleware/logger';
import defaultHook from '@/utils/default-hook';
import * as HttpStatusCode from '@/utils/http-status-codes';

import type { Env } from './types';

export function createRouter() {
  return new OpenAPIHono<{ Bindings: Env }>(
    { strict: false, defaultHook },
  );
}

export function createApp() {
  const app = createRouter();

  app.use(logger(customLogger))
    .use(requestId());

  app.notFound((c) => {
    return c.json({
      message: `Not found - ${c.req.path}`,
    }, HttpStatusCode.NOT_FOUND);
  });
  return app;
}
