# Clarix

Clarix is a reporting platform for freelancers managing Google Ads accounts.

## Workspace

- `apps/backend`: NestJS API
- `apps/frontend`: Next.js dashboard
- `packages/shared`: shared types

## Local setup

```bash
pnpm install
docker compose up -d
pnpm db:migrate
pnpm dev
```

## Local database

Clarix uses Docker Postgres on `localhost:5433` by default to avoid conflicts with a local PostgreSQL service on `5432`.
