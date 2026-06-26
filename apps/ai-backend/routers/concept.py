import asyncio
import base64
import logging
import os
from io import BytesIO
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger("concept")
router = APIRouter(prefix="/concept", tags=["concept"])

# Try models in order until one works — FLUX may need gated access
_FALLBACK_MODELS = [
    "black-forest-labs/FLUX.1-schnell",
    "stabilityai/stable-diffusion-xl-base-1.0",
    "runwayml/stable-diffusion-v1-5",
]


class ConceptRequest(BaseModel):
    prompt: str
    style: Optional[str] = "professional aerospace concept art, detailed technical illustration, clean background"
    count: Optional[int] = 4


async def _generate_one(prompt: str, hf_key: str) -> str:
    from huggingface_hub import AsyncInferenceClient

    client = AsyncInferenceClient(token=hf_key)
    model = os.getenv("CONCEPT_MODEL", _FALLBACK_MODELS[0])
    models_to_try = [model] + [m for m in _FALLBACK_MODELS if m != model]

    for m in models_to_try:
        try:
            image = await client.text_to_image(prompt, model=m)
            buf = BytesIO()
            image.save(buf, format="PNG")
            return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode()}"
        except Exception as e:
            logger.warning(f"Concept model {m} failed: {e}")

    raise RuntimeError("All concept image models failed.")


@router.post("/images")
async def generate_concept_images(req: ConceptRequest):
    hf_key = os.getenv("HF_KEY", "")
    if not hf_key:
        raise HTTPException(status_code=500, detail="HF_KEY not configured.")

    count = max(1, min(4, req.count or 4))
    full_prompt = f"{req.prompt}, {req.style}"

    results = await asyncio.gather(
        *[_generate_one(full_prompt, hf_key) for _ in range(count)],
        return_exceptions=True,
    )

    images = [r for r in results if isinstance(r, str)]
    errors = [str(r) for r in results if isinstance(r, Exception)]

    if errors:
        logger.error(f"Some concept generations failed: {errors}")

    if not images:
        raise HTTPException(status_code=503, detail="All image generation attempts failed. Check HF_KEY and model access.")

    return {"images": images, "count": len(images)}
