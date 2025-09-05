import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';

// set env variables
export type Env = {
  DB: D1Database;
};

export type AppOpenAPI = OpenAPIHono<{ Bindings: Env }>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, { Bindings: Env }>;
