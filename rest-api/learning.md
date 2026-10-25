# Docker Learning — rest-api

Image = built artifact. Container = running instance of it.

## Step 1 — Build the image

```powershell
cd "C:\Personal Apps\system-design\url-shortner\rest-api"
docker build -t url-shortner-api:manual .
```

- `docker build` — reads the `Dockerfile`.
- `-t name:tag` — names the image.
- `.` — build context: this folder, filtered by `.dockerignore`.

Check:

```powershell
docker images
```

The first build was tagged `url-shortnet-api:manual` (typo). Fix it with:

```powershell
docker tag url-shortnet-api:manual url-shortner-api:manual
```

`docker tag` adds a second name. It does not copy the image.

## Step 2 — Run the image

```powershell
docker run --rm --name url-shortner-api url-shortner-api:manual
```

What happened:

```
Unable to find image 'url-shortner-api:manual' locally
pull access denied for url-shortner-api
```

Docker looked locally, didn't find that exact name, then tried Docker Hub. Fix the tag first.

After the tag fix, expect:

```
Error: DATABASE_URL is not set
```

Why: `.env` is excluded by `.dockerignore`, and `docker run` does not read it. The app exits immediately, and `--rm` deletes the container.

## Step 3 — Compose

```powershell
docker compose up --build
```

One command replaced all the manual `docker run` setup. It:

- built the image `rest-api-api` from the `Dockerfile`
- pulled `postgres:17`
- created the network `rest-api_default`
- created the volume `rest-api_postgres_data`
- started `url-shortner-db` and `url-shortner-api`
- streamed logs in the foreground

`Ctrl+C` stops the containers.

### Foreground vs background

```powershell
docker compose up --build        # foreground, shows logs
docker compose up -d --build     # background, returns to prompt
docker compose logs -f api       # follow logs when detached
docker compose ps                # running services
```

### Rebuild rule

```powershell
docker compose up -d --build api   # after code changes
docker compose up -d               # reuses the old image
```

Only the API is rebuilt; Postgres keeps running.

### Stop

```powershell
docker compose down
```

Removes the containers and the network. Keeps the volume, so the database survives.

- `down -d` is invalid: `-d` is a flag for `up`, not `down`.
- `down -v` also deletes the volume and all database data.

### Migrations are separate

```powershell
docker compose exec api npx prisma migrate deploy
```

Starting the containers does not create tables. A fresh volume needs this once.

Verify:

```powershell
docker compose exec -T postgres psql -U postgres -d urlshortner -c '\dt'
```

Expected tables: `Url` and `_prisma_migrations`.

### First run vs second run

- First `up`: Postgres initializes the database.
- Second `up`: `Skipping initialization`, because the volume already has data.

### Build cache

- `npm install` stays `CACHED` until `package*.json` changes.
- `COPY . .` reruns when any file in the build context changes, even `learning.md`.

## Notes

- `--name` names the container; `-t` names the image.
- `docker ps` shows running containers; `docker ps -a` includes stopped ones.
- To inspect a crash, run without `--rm`, then use `docker logs url-shortner-api`.
- The Prisma libssl warning is harmless with the `pg` adapter.

## Test

```powershell
Invoke-RestMethod http://localhost:3000/health

$r = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/url/shorten -ContentType 'application/json' -Body '{"link":"https://example.com"}'

curl.exe -i "http://localhost:3000/$($r.short)"
```

Expected: `{"status":"ok"}`, JSON with a short code, then `302`.

## Next

Test the API. Then try `docker compose down` and `docker compose up -d` to confirm the database survives.
