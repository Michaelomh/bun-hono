import { createRoute, z } from '@hono/zod-openapi';

import { createRouter } from '@/app';
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
    return c.json({
      message: 'health check',
    });
  });

export default router;
