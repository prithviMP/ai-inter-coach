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

Put the model key in `backend/.env`. That file stays untracked. Without `LLM_API_KEY`, `/health` and `/roles` still work, and a turn returns “The coach is not configured.”

Site, from `frontend/`:

```bash
npm install
npm run dev
```

The page is at `http://localhost:3000`. `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000` in `frontend/.env.example`.

## Render (API)

`render.yaml` defines the web service. The SQLite file is `/var/data/coach.db` on a persistent disk, because Render’s normal disk is wiped on restart. A disk needs a paid instance.

In the Render dashboard, set:

- `LLM_API_KEY`
- `LLM_BASE_URL` (an OpenAI-compatible base, such as `https://api.openai.com/v1`)
- `LLM_MODEL`
- `CORS_ORIGINS` — include the Vercel origin, for example `https://your-app.vercel.app`

## Vercel (site)

Create the project from this repo and set the root directory to `frontend`. Set `NEXT_PUBLIC_API_URL` to the Render URL, including `https://`.
