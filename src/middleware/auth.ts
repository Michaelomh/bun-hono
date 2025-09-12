import type { MiddlewareHandler } from 'hono';

import type { Env } from '@/types';

import { auth } from '@/lib/auth';

/**
 * Middleware to extract and set session and user in context
 */
export function authMiddleware(): MiddlewareHandler<Env> {
  return async (c, next) => {
    try {
      // Get the session from the request
      const session = await auth(c).api.getSession({
        headers: c.req.raw.headers,
      });

      // Set session and user in context variables
      if (session?.user && session?.session) {
        c.set('user', session.user);
        c.set('session', session.session);
      }
      else {
        c.set('user', null);
        c.set('session', null);
      }
    }
    catch {
      // If there's an error getting the session, set both to null
      c.set('user', null);
      c.set('session', null);
    }

    await next();
  };
}

/**
 * Middleware to require authentication - throws 401 if not authenticated
 */
export function requireAuth(): MiddlewareHandler<Env> {
  return async (c, next) => {
    const user = c.get('user');
    const session = c.get('session');

    if (!user || !session) {
      return c.json({
        error: 'Unauthorized',
        message: 'Authentication required',
      }, 401);
    }

    await next();
  };
}

/**
 * Optional auth middleware - sets user/session but doesn't require them
 */
export const optionalAuth = authMiddleware;
