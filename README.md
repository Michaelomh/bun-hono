```txt
npm install
npm run dev
```

```txt
npm run deploy
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

## Database migrations

Work flow when working locally

bun run db:generate - generate a migration file based on updates that was done.
(drizzle-kit generate)

bun run db:local:migrate - run the migration script to local db
(wrangler d1 migrations apply --local "bun-hono-d1")


### Release to production
bunx wrangler d1 migrations apply --remote 'bun-hono-d1' --file=./src/db/drizzle/migrations/<migration_file_name>