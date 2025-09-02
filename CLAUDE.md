# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a Cloudflare Workers application built with:

- **Hono** - Web framework for routing and middleware
- **Drizzle ORM** - Database ORM for SQLite/Cloudflare D1
- **Cloudflare D1** - Serverless SQLite database
- **Bun** - JavaScript runtime and package manager

The application entry point is `src/index.ts` which exports a Hono app. Database schema is defined in `src/db/schema.ts`.

## Development Commands

```bash
# Install dependencies
bun i

# Start development server (localhost:8787)
bun run dev

# Deploy to Cloudflare Workers
bun run deploy

# Generate database migrations
bun run db:generate

# Apply migrations to local D1 database
bun run db:local-up

# Apply migrations to production D1 database
bun run db:prod-up

# Open Drizzle Studio for production database
bun run db:studio

# Open Drizzle Studio for local database
bun run db:studio:local

# Generate TypeScript types for Cloudflare bindings
bun run cf-typegen
```

## Database Configuration

Two Drizzle configs exist:

- `drizzle.config.ts` - Production config using D1 HTTP driver with environment variables
- `drizzle.config.local.ts` - Local development config pointing to `.wrangler/state/v3/d1/...`

The D1 database binding is named `bun_hono_d1` and configured in `wrangler.jsonc`.

## Environment Variables

There are 2 places where we store environment variables and it depends on 

Environment variables are defined in the `Env` type in `src/index.ts`:

- `WRANGLER_VAR` - Set in wrangler.jsonc
- `LOCAL_VAR` - Set in .dev.vars file (not tracked)
- `bun_hono_d1` - D1 database binding

For production Drizzle config, set these environment variables:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_DATABASE_ID`
- `CLOUDFLARE_D1_TOKEN`
