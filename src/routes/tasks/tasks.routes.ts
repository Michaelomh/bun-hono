import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/utils/http-status-codes';
import jsonContent from '@/utils/json-content';

const tags = ['tasks'];
const path = '/tasks';

export const list = createRoute({
  method: 'get',
  tags,
  path,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          name: z.string(),
          done: z.boolean(),
        }),
      ),
      'Lists of tasks',
    ),
  },
});

export type ListRoute = typeof list;
