import json
import os
import logging
from typing import List, Optional

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger("chat")
router = APIRouter(prefix="/chat", tags=["chat"])

_DESIGN_SYSTEM = """You are an aerospace engineer AI embedded in Airix, a 3D aircraft design platform.
The user is working on a 3D aircraft or drone design. You are given their current model data as context.

Your role:
- Answer engineering questions about the design (aerodynamics, weight, structural integrity, cost, range, altitude performance)
- Identify design issues (centre-of-gravity problems, unstable configurations, over/under-spec components)
- Give specific, quantitative answers where possible
- If critical info is missing (material, engine type, payload mass), ask before answering
- Respond as a senior aerospace engineer — precise, technical, actionable

Always reference specific component names from the model data when relevant."""

_MAINTENANCE_SYSTEM = """You are an aerospace maintenance AI embedded in Airix fleet management.
You have access to sensor readings, component data, and ML-based predictive analysis for an aircraft or drone fleet.

Your role:
- Answer questions about component health, failure probability, and remaining useful life
- Explain what risk levels (critical / watch / healthy) mean operationally
- Give actionable maintenance recommendations with specific timelines
- Analyse uploaded sensor logs or CSVs if provided in the chat
- Reference component IDs, specific readings, and predicted failure hours

Always cite the component ID and specific data points when answering. Be direct about risk."""


class ChatMessage(BaseModel):
    role: str  # "user" | "ai" | "assistant"
    content: str


class DesignChatRequest(BaseModel):
    message: str
    model_json: Optional[dict] = None
    history: Optional[List[ChatMessage]] = []


class MaintenanceChatRequest(BaseModel):
    message: str
    analysis_result: Optional[dict] = None
    history: Optional[List[ChatMessage]] = []
    attachment_text: Optional[str] = None


def _build_messages(system: str, history: list, user_message: str) -> list:
    messages = [{"role": "system", "content": system}]
    for msg in history:
        role = "assistant" if msg.role in ("ai", "assistant") else "user"
        messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": user_message})
    return messages


async def _groq_chat(messages: list, groq_key: str) -> str:
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    async with httpx.AsyncClient(timeout=60.0) as client:
        res = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
            json={"model": model, "messages": messages, "max_tokens": 1024, "temperature": 0.7},
        )
        if not res.is_success:
            logger.error(f"Groq error {res.status_code}: {res.text}")
            raise HTTPException(status_code=503, detail="Groq API error.")
        return res.json()["choices"][0]["message"]["content"]


async def _gemini_chat(messages: list, gemini_key: str) -> str:
    model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"

    system_text = next((m["content"] for m in messages if m["role"] == "system"), "")
    contents = []
    for msg in messages:
        if msg["role"] == "system":
            continue
        role = "model" if msg["role"] == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": msg["content"]}]})

    payload = {
        "system_instruction": {"parts": [{"text": system_text}]},
        "contents": contents,
        "generationConfig": {"maxOutputTokens": 1024, "temperature": 0.7},
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        res = await client.post(url, json=payload)
        if not res.is_success:
            logger.error(f"Gemini error {res.status_code}: {res.text}")
            raise HTTPException(status_code=503, detail="Gemini API error.")
        return res.json()["candidates"][0]["content"]["parts"][0]["text"]


async def _chat(system: str, history: list, user_message: str) -> str:
    messages = _build_messages(system, history, user_message)
    groq_key = os.getenv("GROQ_KEY", "")
    gemini_key = os.getenv("GEMINI_KEY", "")

    if groq_key:
        return await _groq_chat(messages, groq_key)
    if gemini_key:
        return await _gemini_chat(messages, gemini_key)
    raise HTTPException(
        status_code=500,
        detail="No LLM key configured. Add GROQ_KEY (console.groq.com) or GEMINI_KEY (aistudio.google.com) to .env"
    )


@router.post("/design")
async def design_chat(req: DesignChatRequest):
    system = _DESIGN_SYSTEM
    if req.model_json:
        system += f"\n\nCurrent 3D model:\n{json.dumps(req.model_json, indent=2)}"
    reply = await _chat(system, req.history or [], req.message)
    return {"reply": reply}


@router.post("/maintenance")
async def maintenance_chat(req: MaintenanceChatRequest):
    system = _MAINTENANCE_SYSTEM
    if req.analysis_result:
        system += f"\n\nLatest predictive analysis:\n{json.dumps(req.analysis_result, indent=2)}"
    user_message = req.message
    if req.attachment_text:
        user_message += f"\n\n[Attached file]:\n{req.attachment_text}"
    reply = await _chat(system, req.history or [], user_message)
    return {"reply": reply}
