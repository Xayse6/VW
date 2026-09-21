# Deploy Velox Wrap

## Architecture

- Frontend: Vercel, using the `frontend` directory.
- Backend: Render Web Service, using the `backend` directory.
- Database: Neon PostgreSQL.

## Neon

1. Create a Neon project and copy its pooled connection string.
2. Use that value as `DATABASE_URL` on Render.
3. Keep `sslmode=require` in the Neon connection string.
4. The backend runs the current schema bootstrap during startup. Do not use the demo seed credentials in a public production environment without changing them first.

## Render

The root `render.yaml` can create the backend service. If configuring it manually:

- Root directory: `backend`
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/api/health`

Set these variables:

- `NODE_ENV=production`
- `DATABASE_URL`: Neon pooled connection string
- `JWT_SECRET`: long random secret
- `JWT_REFRESH_SECRET`: another long random secret
- `CORS_ORIGIN`: the exact Vercel URL, for example `https://velox-wrap.vercel.app`
- `FRONTEND_URL`: the same Vercel URL

Render provides `PORT` automatically.

## Vercel

Create a Vercel project with `frontend` as the Root Directory. The build settings are detected from `frontend/package.json`:

- Build command: `npm run build`
- Output directory: `dist`

Set:

- `VITE_API_URL=https://<render-service>.onrender.com/api`

Redeploy after changing `VITE_API_URL`, because Vite embeds it at build time.

## Cookie and CORS requirements

The frontend and backend must use HTTPS in production. The backend sends the refresh token as an HTTP-only `SameSite=None` cookie and only accepts the exact Vercel origin configured in `CORS_ORIGIN`.
