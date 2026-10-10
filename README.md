# AI Interview Coach

Monorepo for the one-hour MVP. The API is FastAPI and SQLite. The Next.js app is a placeholder with no interview screen yet.

## Local

API, from `backend/`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Put the Gemini key in `backend/.env`. That file stays untracked. Without `GEMINI_API_KEY`, `/health` and `/roles` still work, and a turn returns “The coach is not configured.”

Site, from `frontend/`:

```bash
npm install
npm run dev
```

The page is at `http://localhost:3000`. The browser calls `/api` on this site, and the server forwards those calls using `BACKEND_URL`. `frontend/.env.example` sets that to `http://localhost:8000`. Without the file, local development uses the same address.

## Render (API)

`render.yaml` defines the web service. The SQLite file is `/var/data/coach.db` on a persistent disk, because Render’s normal disk is wiped on restart. A disk needs a paid instance.

In the Render dashboard, set:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (defaults to `gemini-3.8-flash`)
- `CORS_ORIGINS` — include the Vercel origin, for example `https://your-app.vercel.app`

## Vercel (site)

Create the project from this repo and set the root directory to `frontend`. Set `BACKEND_URL` to the Render URL, including `https://`, with no slash at the end.
