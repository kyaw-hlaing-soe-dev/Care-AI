# CareAI Python Symptom Analyzer

This is a FastAPI service for the Gemini-backed senior symptom checker. It is
separate from the Firebase/Firestore application backend and must run server-side
so `GEMINI_API_KEY` is never exposed to the browser.

## Run locally

Install the Python dependencies, set `GEMINI_API_KEY` in the server environment,
and start the service from the repository root:

```sh
python -m pip install -r backend/requirements.txt
uvicorn app.main:app --reload
```

The senior endpoint is `POST /api/symptoms/analyze-senior`. The existing
deterministic endpoint remains available at `POST /api/symptoms/analyze`.
The health check is `GET /health`.

When running the frontend in a non-local environment, set the server-only
`CAREAI_SYMPTOMS_API_URL` value to the FastAPI service origin. Local development
defaults to `http://127.0.0.1:8000`. Never use a `VITE_` prefix for provider
credentials; the Gemini key belongs only in the FastAPI server environment.