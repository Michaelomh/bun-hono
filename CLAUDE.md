# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun run dev` - Start development server with Wrangler
- `bun run deploy` - Deploy to Cloudflare Workers with minification
- `bun run cf-typegen` - Generate TypeScript types from Wrangler configuration
- `bun run check-types` - Run TypeScript type checking without emitting files
- `bun run lint` - Run ESLint on the codebase
- `bun run lint:fix` - Run ESLint with automatic fixes

## Technology used

### Current Technologies
- **Hono + Bun** - Web framework and runtime
  - [Hono Docs](https://hono.dev/)
  - [Bun Docs](https://bun.sh/docs)
- **Cloudflare Workers** - Serverless runtime platform
  - [Workers Docs](https://developers.cloudflare.com/workers/)
- **Zod** - TypeScript-first schema validation
  - [Zod Docs](https://zod.dev/)
- **Zod OpenAPI + Scalar** - OpenAPI specification and documentation
  - [Hono Zod OpenAPI Docs](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
  - [Scalar Docs](https://docs.scalar.com/)
- **@antfu/eslint-config** - ESLint configuration
  - [antfu/eslint-config Docs](https://github.com/antfu/eslint-config)

### Planned Technologies
- **Cloudflare D1** - SQLite database for Workers
  - [D1 Docs](https://developers.cloudflare.com/d1/)
- **Drizzle ORM** - TypeScript ORM
  - [Drizzle Docs](https://orm.drizzle.team/)
- **Better Auth** - Authentication library
  - [Better Auth Docs](https://www.better-auth.com/)
- **Vitest + @cloudflare/vitest-pool-workers** - Testing framework
  - [Vitest Docs](https://vitest.dev/)
  - [Vitest Pool Workers](https://github.com/cloudflare/workers-sdk/tree/main/packages/vitest-pool-workers)

## Architecture Overview

This is a Hono-based API running on Cloudflare Workers with OpenAPI specification support.

### Core Structure

- **Entry Point**: `src/index.ts` - Configures the main app with routes and OpenAPI documentation
- **App Factory**: `src/app.ts` - Creates Hono app instances with OpenAPIHono and shared middleware
- **Types**: `src/types.ts` - Environment bindings and OpenAPI type definitions
- **OpenAPI Config**: `src/lib/configure-open-api.ts` - Configures OpenAPI documentation endpoint

### Route Organization

Routes follow a modular pattern:
- `src/routes/` - Route definitions organized by feature
- Each feature has three files:
  - `*.routes.ts` - OpenAPI route definitions using createRoute
  - `*.handlers.ts` - Route handler implementations
  - `*.index.ts` - Combines routes and handlers into a router

Example structure:
```
src/routes/tasks/
├── tasks.routes.ts    # OpenAPI route schemas
├── tasks.handlers.ts  # Handler implementations
└── tasks.index.ts     # Router combining routes + handlers
```

### Code Standards

- Uses `@antfu/eslint-config` with TypeScript support
- Enforces kebab-case filenames (except README.md, CLAUDE.md)
- Uses type definitions instead of interfaces
- Semi-colons and single quotes enforced
- No console statements (warnings only)
- Import sorting with perfectionist plugin

### Environment Setup

Configure Cloudflare bindings in `wrangler.jsonc`. The app expects these environment variables:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment identifier

Pass bindings as generics when creating Hono instances:
```ts
const app = new Hono<{ Bindings: Bindings }>();
```

### API Documentation

- OpenAPI spec available at `/doc`
- Scalar API documentation UI at `/scalar`
- Uses Zod schemas for request/response validation