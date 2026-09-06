# CareAI Python Symptom Analyzer

This is a protected FastAPI service for the Gemini-backed symptom analyzer. It is
separate from the repository's inactive TypeScript Firebase backend and must run
server-side so `GEMINI_API_KEY` is never exposed to the browser.

## Run locally

Install the Python dependencies, set `GEMINI_API_KEY` in a local `.env` file, and
start the service from the repository root:

```sh
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The endpoint is `POST /api/care-ai/analyze-symptoms`. The health check is
`GET /health`.