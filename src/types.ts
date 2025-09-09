import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';

// set env variables
export type Env = {
  DB: D1Database;
  NODE_ENV: string;
};

export type AppOpenAPI = OpenAPIHono<{ Bindings: Env }>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, { Bindings: Env }>;
