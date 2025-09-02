# Bun-hono application

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

## Migrating databases

We use Cloudflare d1 database. Use the following commands

`db:local-up` to apply migrations to local cloudflare d1 instance. You can view this instance in .wrangler/state/v3/d1

`db:prod-up` to apply migrations to remote cloudflare d1 instance. This is the "production" instance of the database. View this database in the Cloudflare d1 dashboard.
