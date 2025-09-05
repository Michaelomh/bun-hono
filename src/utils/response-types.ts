import type { z } from 'zod';

// Extract the response type from an OpenAPI route for a specific status code
export type ExtractResponseType<TRoute, TStatus extends number | string = 200> = 
  TRoute extends { responses: Record<TStatus, { content: { 'application/json': { schema: infer S } } }> }
    ? S extends z.ZodType<infer T>
      ? T
      : never
    : never;