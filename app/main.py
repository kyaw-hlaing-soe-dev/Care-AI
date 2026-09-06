"""FastAPI application entry point for the CareAI symptom analyzer."""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.symptoms import router as symptoms_router


load_dotenv()

app = FastAPI(title="CareAI Symptom Analyzer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(symptoms_router)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Provide a lightweight process health check without calling Gemini."""

    return {"status": "ok", "environment": os.getenv("ENVIRONMENT", "development")}