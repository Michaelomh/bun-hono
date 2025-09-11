# .CLAUDE.md - Codebase Memory for Claude Code

This file provides comprehensive guidance for Claude Code when working with this Bun + Hono + Cloudflare Workers API codebase. This is a passion project backend designed to be easily maintained and picked up by others.

## Project Overview

**Technology Stack:**
- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Framework**: Hono (lightweight web framework)
- **Platform**: Cloudflare Workers (serverless)
- **Database**: Cloudflare D1 (SQLite for Workers)
- **ORM**: Drizzle ORM with Drizzle Kit
- **Validation**: Zod with OpenAPI integration
- **API Documentation**: Scalar UI with OpenAPI 3.0
- **Linting**: @antfu/eslint-config with TypeScript support

## File Structure & Architecture

```
bun-hono/
├── src/
│   ├── app.ts                 # App factory with middleware setup
│   ├── index.ts              # Main entry point, route registration
│   ├── types.ts              # Global TypeScript type definitions
│   ├── db/
│   │   ├── index.ts          # Database instance factory
│   │   ├── schema.ts         # Drizzle table schemas + Zod schemas
│   │   └── migrations/       # Database migration files
│   ├── lib/
│   │   └── configure-open-api.ts  # OpenAPI documentation setup
│   ├── middleware/
│   │   └── logger.ts         # Custom logging middleware
│   ├── routes/
│   │   ├── index.routes.ts   # Root route definitions
│   │   └── [feature]/        # Feature-based route organization
│   │       ├── *.routes.ts   # OpenAPI route definitions
│   │       ├── *.handlers.ts # Route handler implementations
│   │       └── *.index.ts    # Router composition
│   └── utils/
│       ├── create-error-schema.ts    # Zod error schema generator
│       ├── default-hook.ts           # OpenAPI validation hook
│       ├── http-status-codes.ts      # HTTP status constants
│       ├── id-params-schema.ts       # Common ID parameter schema
│       ├── json-content.ts           # OpenAPI JSON content helper
│       ├── json-content-required.ts  # Required JSON content helper
│       └── response-types.ts         # Common response type definitions
├── .env                      # Environment variables (local)
├── .env.example             # Environment template
├── wrangler.jsonc           # Cloudflare Workers configuration
├── drizzle.config.ts        # Production Drizzle configuration
├── drizzle.config.local.ts  # Local development Drizzle configuration
├── eslint.config.js         # ESLint configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Architecture Patterns

### 1. Route Organization Pattern
Each feature follows a three-file pattern for maximum clarity:

**`*.routes.ts`** - OpenAPI Route Definitions
- Uses `createRoute()` from `@hono/zod-openapi`
- Defines HTTP methods, paths, request/response schemas
- Exports route objects and TypeScript types
- Example: `tasks.routes.ts` defines `listAllTasks`, `createTask`, etc.

**`*.handlers.ts`** - Handler Implementations
- Contains actual route logic and business operations
- Uses typed handlers: `AppRouteHandler<RouteType>`
- Handles database operations via `dbInstance(c)`
- Returns JSON responses with proper HTTP status codes

**`*.index.ts`** - Router Composition
- Combines routes and handlers using `createRouter()`
- Uses `.openapi(route, handler)` method for type-safe binding
- Exports configured router for main app registration

### 2. Type Safety Architecture
- **Global Types**: `src/types.ts` defines `Env`, `AppOpenAPI`, `AppRouteHandler`
- **Environment Bindings**: Cloudflare Workers bindings typed in `Env`
- **Route Types**: Each route exports its type for handler type safety
- **Schema Integration**: Drizzle schemas auto-generate Zod schemas for validation

### 3. Database Architecture
- **Schema Definition**: `src/db/schema.ts` - Drizzle table definitions
- **Zod Integration**: Automatic schema generation via `drizzle-zod`
  - `selectTasksSchema` - for select queries
  - `insertTasksSchema` - for inserts (excludes auto-generated fields)
  - `updateTasksSchema` - for updates (partial insert schema)
- **Instance Factory**: `dbInstance(c)` creates type-safe database connection
- **Migration Management**: Drizzle Kit handles schema migrations

### 4. Validation & Error Handling
- **Request Validation**: Zod schemas validate all inputs automatically
- **Error Responses**: `defaultHook` provides consistent error formatting
- **Status Codes**: Centralized in `src/utils/http-status-codes.ts`
- **Error Schemas**: `createErrorSchema()` generates validation error schemas

## Development Workflows

### Adding a New Feature
1. **Create feature directory**: `src/routes/[feature-name]/`
2. **Define schemas**: Add database table to `src/db/schema.ts`
3. **Generate migration**: `bun run db:generate`
4. **Create route files**:
   - `[feature].routes.ts` - OpenAPI definitions
   - `[feature].handlers.ts` - Handler implementations
   - `[feature].index.ts` - Router composition
5. **Register routes**: Add to routes array in `src/index.ts`
6. **Apply migration**: `bun run db:local:migrate` (local) or `bun run db:prod:migrate` (production)

### Database Operations
- **Local Development**: Uses `.wrangler/state/v3/d1/` for local SQLite
- **Schema Changes**: Modify `src/db/schema.ts`, then `bun run db:generate`
- **Migration**: `bun run db:local:migrate` for local, `bun run db:prod:migrate` for prod
- **Database Studio**: `bun run db:local:studio` for local admin UI
- **Reset Local DB**: `bun run db:local:reset` removes all local data

### Code Standards & Quality
- **File Naming**: kebab-case enforced (except README.md, CLAUDE.md)
- **Code Style**: Single quotes, semicolons, 2-space indentation
- **Type Definitions**: Use `type` instead of `interface`
- **Import Sorting**: Automatic via perfectionist plugin
- **No Console**: Warnings only (use `customLogger` instead)
- **Validation**: `bun run check-types` for TypeScript, `bun run lint` for ESLint

## Environment Configuration

### Required Environment Variables
```bash
# .env
NODE_ENV=development|production
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_DATABASE_ID=your-d1-database-id
CLOUDFLARE_D1_TOKEN=your-cloudflare-api-token
```

### Cloudflare Bindings
Configured in `wrangler.jsonc`:
- `DB`: Cloudflare D1 database binding
- Accessible in handlers via `c.env.DB`

## API Documentation

### Endpoints
- **API Docs**: `/docs` - Scalar API documentation UI
- **OpenAPI Spec**: `/doc` - Raw OpenAPI 3.0 JSON specification
- **Health Check**: `/` - Simple "Hello Hono!" response
- **Environment**: `/env` - Returns current NODE_ENV

### OpenAPI Integration
- Zod schemas automatically generate OpenAPI specifications
- Request/response validation handled by Hono OpenAPI middleware
- Type-safe route handlers with automatic validation
- Consistent error response format via `defaultHook`

## Development Commands

```bash
# Development
bun run dev                    # Start dev server with hot reload
bun run check-types           # TypeScript type checking
bun run lint                  # Run ESLint
bun run lint:fix             # Auto-fix ESLint issues

# Database
bun run db:generate          # Generate migrations from schema changes
bun run db:local:migrate     # Apply migrations to local D1
bun run db:local:studio      # Open Drizzle Studio for local DB
bun run db:local:reset       # Reset local database
bun run db:prod:migrate      # Apply migrations to production D1
bun run db:prod:studio       # Open Drizzle Studio for production DB

# Deployment
bun run deploy               # Deploy to Cloudflare Workers with minification
bun run cf-typegen          # Generate TypeScript types from Wrangler
```

## Key Implementation Notes

### 1. Path Aliases
Uses `@/` for `src/` directory via TypeScript path mapping in `tsconfig.json`

### 2. Middleware Stack
Applied in `createApp()`:
- CORS enabled for cross-origin requests
- Custom logger for request logging with timestamps
- Request ID generation for tracing
- Global 404 handler with consistent JSON response

### 3. Database Connection
- Uses context-based database instances: `dbInstance(c)`
- Provides type-safe Drizzle client with schema
- Automatically handles Cloudflare D1 binding

### 4. Error Handling Strategy
- Validation errors: 422 Unprocessable Entity with detailed field errors
- Not found errors: 404 with descriptive messages
- All errors return consistent JSON structure
- Success responses use appropriate HTTP status codes

### 5. Logging Strategy
- Custom logger with timestamps: `customLogger(message, ...args)`
- Replaces console.log for better Worker compatibility
- ESLint warns on direct console usage

## Passion Project Considerations

This codebase is designed with the following principles for passion project sustainability:

### 1. Easy Pickup
- Clear separation of concerns with predictable file patterns
- Comprehensive type safety reduces runtime surprises
- Self-documenting API via OpenAPI integration
- Minimal but powerful tech stack reduces learning curve

### 2. Maintainability
- Consistent code style enforced by ESLint + Prettier
- Database migrations provide versioned schema changes
- Modular route organization scales naturally
- Strong typing catches errors early

### 3. Developer Experience
- Hot reload development with Wrangler
- Visual database management via Drizzle Studio
- Interactive API testing via Scalar docs
- Local and production environment parity

### 4. Deployment Simplicity
- Single command deployment to Cloudflare Workers
- Automatic type generation from Worker configuration
- Environment variable management via Wrangler
- Serverless scaling without infrastructure management

## Extension Recommendations

For future development, consider adding:

1. **Authentication**: Better Auth integration (planned)
2. **Testing**: Vitest with Cloudflare Workers pool (planned)
3. **Rate Limiting**: Cloudflare Workers rate limiting
4. **Caching**: Cloudflare KV for application caching
5. **Monitoring**: Workers Analytics or external APM
6. **Background Jobs**: Cloudflare Queues for async processing
7. **File Storage**: Cloudflare R2 for object storage
8. **Email**: Cloudflare Email Workers or external service

This architecture provides a solid foundation for rapid API development while maintaining code quality and ease of maintenance.