# AGENTS.md

Stack: Node ESM (`"type": "module"`), Express 5, Prisma ORM with `@prisma/adapter-pg` (`pg`) against Prisma Postgres. No TypeScript build, no tests, no lint, no CI.

## Commands

- `npm run dev` — dev server with `node --watch index.js` (port `PORT` or 3000).
- `npm start` — prod server (`node index.js`).
- `npx prisma generate` — regenerate client after editing `prisma/schema.prisma`. Output is committed-local at `prisma/generated/`.
- `npm test` is a placeholder (`exit 1`) — there are no tests. Verify with `curl` instead.

## Env

- Requires `DATABASE_URL` (see `.env`). `lib/prisma.js` throws at import time if unset.
- `dotenv/config` is imported in both `index.js` and `lib/prisma.js`; `.env` loads automatically.

## Architecture

Layered flow, one domain only — follow it for changes:

`index.js` → `router/url.route.js` → `controllers/urlController.js` → `services/url.service.js` → `repositories/url.repositories.js` → `lib/prisma.js`

- `index.js`: mounts `/api/url`, then `GET /:code` redirect, then 404 JSON fallback.
- Single model `Url { id, original, short @unique, createdAt }` in `prisma/schema.prisma`. No migrations dir, no `prisma.config.ts`; datasource has no `url` — connection comes from the `PrismaPg` adapter in `lib/prisma.js`.

## API contract

- `POST /api/url/shorten` with JSON `{ "link": "<http(s) URL>" }` — field is `link`, not `url`. Returns `{ link, short, shortUrl }` with 201 (created) or 200 (dedupe hit).
- `GET /:code` → 302 redirect to `original`; 404 JSON if unknown.
- `GET /health` → `{ status: "ok" }`.

## Gotchas

- `lib/prisma.js` imports `../prisma/generated/client.ts` (`.ts` extension intentional — Node type-stripping resolves it). Do not "fix" to `.js`.
- `shortenLink` dedupes on exact `original` match and returns `{ url, created }`; controller maps that to 200 vs 201.
- Short codes are 7-char base62 from `crypto.randomBytes`, retried up to 5× on Prisma `P2002` unique collision. Only `http:`/`https:` URLs pass validation; errors carry `.status` which the controller uses for the HTTP code.
- Route order in `index.js` matters: `/api/url` must stay mounted before `/:code`, otherwise short-code route shadows the API.
