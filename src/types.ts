import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';

import type { auth } from './lib/auth';

// set env variables
export type Env = {
  Bindings: {
    DB: D1Database;
    NODE_ENV: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  };
  Variables: {
    user: ReturnType<typeof auth>['$Infer']['Session']['user'] | null;
    session: ReturnType<typeof auth>['$Infer']['Session']['session'] | null;
  };
};

export type AppOpenAPI = OpenAPIHono<Env>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, Env>;
