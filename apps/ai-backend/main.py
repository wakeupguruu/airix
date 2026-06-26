import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import chat, concept, generate, maintenance

load_dotenv()

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Airix AI Backend",
    description="3D generation, AI chat, concept studio, and predictive maintenance.",
    version="2.0.0",
)

_DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8080",
]

_extra = os.getenv("CORS_ORIGINS", "")
_ALLOWED_ORIGINS = _DEFAULT_ORIGINS + [o.strip() for o in _extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(generate.router)
app.include_router(chat.router)
app.include_router(concept.router)
app.include_router(maintenance.router)


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Airix AI Backend",
        "version": "2.0.0",
        "endpoints": {
            "3d_generation": ["POST /generate", "GET /task/{provider}/{task_id}"],
            "chat": ["POST /chat/design", "POST /chat/maintenance"],
            "concept_studio": ["POST /concept/images"],
            "maintenance": ["POST /maintenance/analyse", "POST /maintenance/analyse/json"],
        },
    }
