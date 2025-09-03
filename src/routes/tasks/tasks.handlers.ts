import type { RouteHandler } from '@hono/zod-openapi';

import { customLogger } from '@/middleware/logger';

import type { ListRoute } from './tasks.routes';

export const list: RouteHandler<ListRoute> = (c) => {
  customLogger('hello');
  return c.json([{
    name: 'THIS NAME',
    done: false,
  }]); 
};
