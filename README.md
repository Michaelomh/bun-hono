# Bun-hono application

Goal: The goal of this Bun-hono application is to master and learn creation of a Hono API Server on Cloudflare workers.

In addition, to also master some backend technologies/concepts:

| Technolgo            | Usage                     | Done |
| :------------------- | :------------------------ | ---: |
| Bun + Hono           | Web application framework |   ✅ |
| CloudFlare Workers   | Deployment                |   ✅ |
| CloudFlare D1        | SQLite database           |   ✅ |
| @antfu/eslint-config | eslint & prettier         |   ✅ |
| Drizzle ORM + Kit    | ORM and migration         |   ✅ |
| Zod                  | Validation                |   ✅ |
| Zod OpenAPI + Scalar | Documentation             |   ✅ |
| Better Auth          | Authentication and RBAC   |   ❌ |
| Vitest               | Testing                   |   ❌ |

## Installation and running

Run the following scripts would install all of the project dependencies and then run the hono server on localhost:8787.

```bash
bun i
bun run dev
```

## Deploying

Run the following scripts to deploy the Hono server into cloudflare workers. You are able to access the app from here: http://bun-hono.michaelomg.workers.dev/

```bash
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

## Migrating databases

We use Cloudflare d1 database. Use the following commands:

- `db:generate` to generate migration scripts based on the changes to the drizzle schema.
- `db:local:migrate` to apply migrations to local cloudflare d1 instance. You can view this instance in .wrangler/state/v3/d1
- `db:local:reset` to reset the local sqlite database by removing the sqlite db instance. Run `db:local-up` to bring back the database to the latest state.
- `db:prod:migrate` to apply migrations to remote cloudflare d1 instance. This is the "production" instance of the database. View this database in the Cloudflare d1 dashboard.

### Other Scripts

- `db:prod:studio` to run drizzle kit studio to see the database in production.
- `db:local:studio` to run drizzle kit studio to see the database locally.
- ❌ to run only a single migration script locally.
- ❌ to run only a single migration script to production.
