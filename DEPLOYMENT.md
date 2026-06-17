# Deployment

## Frontend: Vercel

Use the repository root as the Vercel project root.

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_URL=https://ccdlib-backend.onrender.com`

The included `vercel.json` also rewrites all routes to `index.html`, so refreshing inside the React app will not return a 404.

## Backend: Render

Use the included `render.yaml` Blueprint, or create a Rust web service manually with:

- Build command: `cd ccdlib && cargo build --release`
- Start command: `cd ccdlib && ./target/release/ccdlib`
- Health check path: `/api/health`

Required Render environment variables:

- `DATABASE_URL`: Supabase Postgres connection string
- `JWT_SECRET`: long random string
- `PORT`: `8000`
- `CLIENT_URL`: `https://ccdlibrary.vercel.app`
- `ALLOWED_ORIGINS`: `https://ccdlibrary.vercel.app,https://ccdlib.vercel.app,http://localhost:5173,http://localhost:3000`

Optional for Vercel preview deployments:

- `ALLOW_VERCEL_PREVIEWS=true`

Keep local `.env` files out of git. If real Supabase credentials were ever committed or shared, rotate the database password and service keys in Supabase.
