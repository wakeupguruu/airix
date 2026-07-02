"""
gRPC server implementing AIService from apps/backend/proto/ai/ai.proto.
Transport layer only — business logic reused from routers/.

Runs inside the FastAPI event loop (see main.py lifespan) or standalone:
    python grpc_server.py
"""
import asyncio
import io
import json
import logging
import os
from datetime import datetime

import grpc
import httpx
import pandas as pd

import ai_pb2
import ai_pb2_grpc
from routers.chat import _DESIGN_SYSTEM, _MAINTENANCE_SYSTEM, _chat
from routers.concept import _generate_one
from routers.maintenance import _normalise_columns, predict_component

logger = logging.getLogger("grpc_server")

# ── 3D generation providers ───────────────────────────────────────────────────
# job_id is "provider:task_id" so GenerateStatus knows which provider to poll
# (proto has no provider field).


async def _start_generation(mode: str, prompt: str, image_url: str) -> str:
    provider = os.getenv("AI_3D_PROVIDER", "piapi")

    if provider == "piapi":
        key = os.getenv("TELLIST_AI", "")
        if not key:
            raise RuntimeError("TELLIST_AI (PiAPI) key not configured.")
        task_type = "image-to-3d" if mode == "image_to_model" else "text-to-3d"
        input_payload = {"image": image_url} if mode == "image_to_model" else {"prompt": prompt}
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(
                "https://api.piapi.ai/api/v1/task",
                headers={"x-api-key": key, "Content-Type": "application/json"},
                json={"model": "Qubico/trellis", "task_type": task_type, "input": input_payload},
            )
            res.raise_for_status()
            task_id = res.json().get("data", {}).get("task_id")
            if not task_id:
                raise RuntimeError("No task ID returned from PiAPI.")
            return f"piapi:{task_id}"

    if provider == "tripo":
        key = os.getenv("TRIPO_KEY", "")
        if not key:
            raise RuntimeError("TRIPO_KEY not configured.")
        if mode == "image_to_model":
            payload = {"type": "image_to_model", "file": {"type": "jpg", "url": image_url}}
        else:
            payload = {"type": "text_to_model", "prompt": prompt}
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(
                "https://api.tripo3d.ai/v2/openapi/task",
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json=payload,
            )
            res.raise_for_status()
            task_id = res.json().get("data", {}).get("task_id")
            if not task_id:
                raise RuntimeError("No task ID returned from Tripo3D.")
            return f"tripo:{task_id}"

    raise RuntimeError(f"Unsupported AI_3D_PROVIDER: {provider}")


async def _poll_generation(job_id: str) -> tuple[str, str]:
    """Returns (status, model_url) with status in processing|done|failed."""
    provider, _, task_id = job_id.partition(":")

    if provider == "piapi":
        key = os.getenv("TELLIST_AI", "")
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.get(
                f"https://api.piapi.ai/api/v1/task/{task_id}",
                headers={"x-api-key": key},
            )
            res.raise_for_status()
            data = res.json().get("data", {})
            status = data.get("status", "")
            if status == "completed":
                out = data.get("output", {})
                model_url = (
                    out.get("model") or out.get("model_url") or out.get("url") or out.get("mesh")
                    or next(
                        (v for v in out.values()
                         if isinstance(v, str) and any(v.endswith(e) for e in (".glb", ".gltf", ".obj"))),
                        "",
                    )
                )
                return "done", model_url or ""
            if status in ("failed", "cancelled"):
                return "failed", ""
            return "processing", ""

    if provider == "tripo":
        key = os.getenv("TRIPO_KEY", "")
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.get(
                f"https://api.tripo3d.ai/v2/openapi/task/{task_id}",
                headers={"Authorization": f"Bearer {key}"},
            )
            res.raise_for_status()
            data = res.json().get("data", {})
            status = data.get("status", "")
            if status == "success":
                model_url = (
                    data.get("output", {}).get("model")
                    or data.get("result", {}).get("model", {}).get("url")
                    or ""
                )
                return "done", model_url
            if status in ("failed", "cancelled", "banned", "expired"):
                return "failed", ""
            return "processing", ""

    raise RuntimeError(f"Unknown provider in job_id: {job_id!r}")


# ── Maintenance helpers ───────────────────────────────────────────────────────


def _components_from_request(attachment_text: str, previous_sensor_data: str) -> list[dict]:
    if attachment_text.strip():
        try:
            df = pd.read_csv(io.StringIO(attachment_text))
            df = _normalise_columns(df)
            df = df.where(pd.notna(df), None)
            return df.to_dict(orient="records")
        except Exception as e:
            logger.warning(f"attachment_text CSV parse failed: {e}")
    if previous_sensor_data.strip():
        try:
            data = json.loads(previous_sensor_data)
            if isinstance(data, list):
                return data
            if isinstance(data, dict):
                return data.get("components") or []
        except Exception as e:
            logger.warning(f"previous_sensor_data parse failed: {e}")
    return []


def _build_snapshot(components: list[dict]) -> dict:
    results = [predict_component(c) for c in components]
    critical = sum(1 for r in results if r["risk_level"] == "critical")
    watch = sum(1 for r in results if r["risk_level"] == "watch")
    overall = "critical" if critical else ("watch" if watch else "healthy")
    return {
        "analysed_at": datetime.utcnow().isoformat() + "Z",
        "risk_level": overall,
        "summary": {
            "critical": critical,
            "watch": watch,
            "healthy": len(results) - critical - watch,
            "total": len(results),
        },
        "components": results,
    }


# ── Design chat JSON contract ─────────────────────────────────────────────────

_DESIGN_JSON_INSTRUCTION = """

Respond ONLY with a single JSON object, no markdown fences, in this exact shape:
{"type": "text", "content": "<your answer>", "follow_up_question": "<one short follow-up or empty string>", "generation_prompt": ""}

Set "type" to "model_gen" ONLY when the user explicitly asks you to generate/create a new 3D model or component.
In that case put a concise text-to-3D prompt describing the component in "generation_prompt"
and a short confirmation message in "content"."""


def _parse_design_reply(reply: str) -> dict:
    text = reply.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
    try:
        data = json.loads(text)
        if isinstance(data, dict) and "content" in data:
            return data
    except Exception:
        pass
    # LLM ignored the JSON contract — treat the whole reply as plain text
    return {"type": "text", "content": reply, "follow_up_question": "", "generation_prompt": ""}


# ── Servicer ──────────────────────────────────────────────────────────────────


class AIServicer(ai_pb2_grpc.AIServiceServicer):
    async def Generate(self, request, context):
        logger.info(f"Generate: mode={request.mode} chat_id={request.chat_id}")
        if request.mode not in ("text_to_model", "image_to_model"):
            await context.abort(grpc.StatusCode.INVALID_ARGUMENT, f"invalid mode: {request.mode}")
        try:
            job_id = await _start_generation(request.mode, request.prompt, request.image_url)
        except Exception as e:
            logger.error(f"Generate failed: {e}")
            await context.abort(grpc.StatusCode.INTERNAL, f"generation start failed: {e}")
        return ai_pb2.GenerateResponse(job_id=job_id, status="processing")

    async def GenerateStatus(self, request, context):
        try:
            status, model_url = await _poll_generation(request.job_id)
        except Exception as e:
            logger.error(f"GenerateStatus failed: {e}")
            await context.abort(grpc.StatusCode.INTERNAL, f"status poll failed: {e}")
        return ai_pb2.GenerateStatusResponse(status=status, model_url=model_url, chat_id=request.chat_id)

    async def ConceptImages(self, request, context):
        logger.info(f"ConceptImages: chat_id={request.chat_id}")
        hf_key = os.getenv("HF_KEY", "")
        if not hf_key:
            await context.abort(grpc.StatusCode.FAILED_PRECONDITION, "HF_KEY not configured")
        style = "professional aerospace concept art, detailed technical illustration, clean background"
        full_prompt = f"{request.prompt}, {style}"
        results = await asyncio.gather(
            *[_generate_one(full_prompt, hf_key) for _ in range(4)],
            return_exceptions=True,
        )
        images = [r for r in results if isinstance(r, str)]
        if not images:
            await context.abort(grpc.StatusCode.INTERNAL, "all concept image generations failed")
        return ai_pb2.ConceptImagesResponse(images=images)

    async def DesignChat(self, request, context):
        logger.info(f"DesignChat: chat_id={request.chat_id}")
        system = _DESIGN_SYSTEM
        if request.scene_json.strip():
            system += f"\n\nCurrent 3D scene:\n{request.scene_json}"
        system += _DESIGN_JSON_INSTRUCTION
        try:
            reply = await _chat(system, list(request.history), request.prompt)
        except Exception as e:
            logger.error(f"DesignChat LLM failed: {e}")
            await context.abort(grpc.StatusCode.INTERNAL, f"LLM call failed: {e}")

        data = _parse_design_reply(reply)
        resp_type = data.get("type", "text")
        job_id = ""
        if resp_type == "model_gen":
            gen_prompt = data.get("generation_prompt") or request.prompt
            try:
                job_id = await _start_generation("text_to_model", gen_prompt, "")
            except Exception as e:
                logger.error(f"In-chat generation failed: {e}")
                resp_type = "text"
                data["content"] = f"{data.get('content', '')}\n\n(Generation could not be started: {e})"
        return ai_pb2.DesignChatResponse(
            type=resp_type,
            content=str(data.get("content", "")),
            follow_up_question=str(data.get("follow_up_question", "") or ""),
            job_id=job_id,
        )

    async def MaintenanceAnalyse(self, request, context):
        logger.info(f"MaintenanceAnalyse: management_id={request.management_id}")
        components = _components_from_request(request.attachment_text, request.previous_sensor_data)
        snapshot = _build_snapshot(components) if components else {}

        system = _MAINTENANCE_SYSTEM
        system += f"\n\nVehicle type: {request.vehicle_type or 'UNKNOWN'}"
        if snapshot:
            system += f"\n\nLatest ML predictive analysis:\n{json.dumps(snapshot, indent=2)}"

        user_message = request.prompt or "Analyse this data."
        if request.attachment_text.strip():
            user_message += f"\n\n[Attached sensor data]:\n{request.attachment_text[:8000]}"

        try:
            content = await _chat(system, list(request.history), user_message)
        except Exception as e:
            logger.error(f"MaintenanceAnalyse LLM failed: {e}")
            if snapshot:
                # Degrade gracefully: ML reports still useful without LLM prose
                content = " ".join(c["report"] for c in snapshot["components"])
            else:
                await context.abort(grpc.StatusCode.INTERNAL, f"LLM call failed: {e}")

        return ai_pb2.MaintenanceAnalyseResponse(
            content=content,
            analysis_snapshot=json.dumps(snapshot) if snapshot else "{}",
        )


# ── Server lifecycle ──────────────────────────────────────────────────────────


def build_server() -> grpc.aio.Server:
    server = grpc.aio.server(
        options=[
            # base64 concept images are large — raise beyond the 4MB default
            ("grpc.max_send_message_length", 64 * 1024 * 1024),
            ("grpc.max_receive_message_length", 16 * 1024 * 1024),
        ]
    )
    ai_pb2_grpc.add_AIServiceServicer_to_server(AIServicer(), server)
    port = os.getenv("GRPC_PORT", "50051")
    server.add_insecure_port(f"[::]:{port}")
    logger.info(f"gRPC AIService listening on :{port}")
    return server


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    logging.basicConfig(level=logging.INFO)

    async def _main():
        server = build_server()
        await server.start()
        await server.wait_for_termination()

    asyncio.run(_main())
