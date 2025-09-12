import { createRoute, z } from '@hono/zod-openapi';

import { createRouter } from '@/app';
import { customLogger } from '@/middleware/logger';
import jsonContent from '@/utils/json-content';

const router = createRouter()
  .openapi(createRoute({
    tags: ['index'],
    method: 'get',
    path: '/',
    responses: {
      200: jsonContent(
        z.object({
          message: z.string(),
        }),
        'My API index',
      ),
    },
  }), (c) => {
    customLogger('Testing Logger');

    const user = c.get('user');
    const session = c.get('session');

    customLogger('User:', JSON.stringify(user, null, 2));
    customLogger('Session:', JSON.stringify(session, null, 2));

    return c.json({
      message: 'Hello Hono!',
      auth: {
        user,
        session,
        isAuthenticated: !!(user && session),
      },
    });

    return c.json({
      message: 'health check',
    });
  });

export default router;
