import os
import base64
import logging
from typing import Optional

import httpx
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

logger = logging.getLogger("generate")
router = APIRouter(tags=["generate"])


@router.post("/generate")
async def generate_3d_model(
    provider: str = Form("piapi"),
    prompt: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    ss_sampling_steps: Optional[int] = Form(50),
    slat_sampling_steps: Optional[int] = Form(50),
    ss_guidance_strength: Optional[float] = Form(7.5),
    slat_guidance_strength: Optional[float] = Form(3.0),
):
    PIAPI_KEY = os.getenv("TELLIST_AI", "")
    HF_KEY = os.getenv("HF_KEY", "")
    TRIPO_KEY = os.getenv("TRIPO_KEY", "")

    logger.info(f"Generation request: provider={provider}, prompt={prompt!r}, file={file.filename if file else None}")

    if not prompt and not file:
        raise HTTPException(status_code=400, detail="Provide a text prompt or image file.")

    if provider == "piapi":
        if not PIAPI_KEY:
            raise HTTPException(status_code=500, detail="TELLIST_AI (PiAPI) key not configured.")

        task_type = "text-to-3d"
        input_payload: dict = {}

        if file:
            task_type = "image-to-3d"
            content = await file.read()
            input_payload["image"] = f"data:{file.content_type};base64,{base64.b64encode(content).decode()}"
        else:
            input_payload["prompt"] = prompt

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                res = await client.post(
                    "https://api.piapi.ai/api/v1/task",
                    headers={"x-api-key": PIAPI_KEY, "Content-Type": "application/json"},
                    json={
                        "model": "Qubico/trellis",
                        "task_type": task_type,
                        "input": {
                            **input_payload,
                            "ss_sampling_steps": ss_sampling_steps,
                            "slat_sampling_steps": slat_sampling_steps,
                            "ss_guidance_strength": ss_guidance_strength,
                            "slat_guidance_strength": slat_guidance_strength,
                        },
                    },
                )
                res.raise_for_status()
                task_id = res.json().get("data", {}).get("task_id")
                if not task_id:
                    raise HTTPException(status_code=500, detail="No task ID returned from PiAPI.")
                return {"success": True, "provider": "piapi", "task_id": task_id, "status": "queued"}
            except httpx.HTTPStatusError as e:
                logger.error(f"PiAPI error {e.response.status_code}: {e.response.text}")
                raise HTTPException(status_code=502, detail="Upstream 3D generation provider error.")

    elif provider == "tripo":
        if not TRIPO_KEY:
            raise HTTPException(status_code=500, detail="TRIPO_KEY not configured.")

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                if file:
                    content = await file.read()
                    upload = await client.post(
                        "https://api.tripo3d.ai/v2/openapi/upload",
                        headers={"Authorization": f"Bearer {TRIPO_KEY}"},
                        files={"file": (file.filename, content, file.content_type)},
                    )
                    upload.raise_for_status()
                    image_token = upload.json().get("data", {}).get("image_token")
                    res = await client.post(
                        "https://api.tripo3d.ai/v2/openapi/task",
                        headers={"Authorization": f"Bearer {TRIPO_KEY}", "Content-Type": "application/json"},
                        json={"type": "image_to_model", "file": {"type": "jpg", "file_token": image_token}},
                    )
                else:
                    res = await client.post(
                        "https://api.tripo3d.ai/v2/openapi/task",
                        headers={"Authorization": f"Bearer {TRIPO_KEY}", "Content-Type": "application/json"},
                        json={"type": "text_to_model", "prompt": prompt},
                    )
                res.raise_for_status()
                task_id = res.json().get("data", {}).get("task_id")
                if not task_id:
                    raise HTTPException(status_code=500, detail="No task ID returned from Tripo3D.")
                return {"success": True, "provider": "tripo", "task_id": task_id, "status": "queued"}
            except httpx.HTTPStatusError as e:
                logger.error(f"Tripo3D error {e.response.status_code}: {e.response.text}")
                raise HTTPException(status_code=502, detail="Upstream 3D generation provider error.")

    elif provider == "hf":
        if not HF_KEY:
            raise HTTPException(status_code=500, detail="HF_KEY not configured.")
        # HuggingFace Hunyuan3D-2 — client handled on frontend via Gradio SDK
        return {
            "success": True,
            "provider": "hf",
            "task_id": f"hf_passthrough",
            "status": "frontend_handled",
            "message": "HuggingFace generation is handled directly by the frontend Gradio client.",
        }

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")


@router.get("/task/{provider}/{task_id}")
async def get_task_status(provider: str, task_id: str):
    PIAPI_KEY = os.getenv("TELLIST_AI", "")
    TRIPO_KEY = os.getenv("TRIPO_KEY", "")

    if provider == "piapi":
        if not PIAPI_KEY:
            raise HTTPException(status_code=500, detail="TELLIST_AI key not configured.")
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.get(
                f"https://api.piapi.ai/api/v1/task/{task_id}",
                headers={"x-api-key": PIAPI_KEY},
            )
            if not res.is_success:
                raise HTTPException(status_code=res.status_code, detail="Failed to fetch PiAPI task status.")
            data = res.json().get("data", {})
            status = data.get("status")
            result: dict = {"status": status, "progress": status}
            if status == "completed":
                out = data.get("output", {})
                model_url = (
                    out.get("model") or out.get("model_url") or out.get("url") or out.get("mesh")
                    or next(
                        (v for v in out.values() if isinstance(v, str) and any(v.endswith(e) for e in [".glb", ".gltf", ".obj"])),
                        None,
                    )
                )
                result["model_url"] = model_url
            return result

    elif provider == "tripo":
        if not TRIPO_KEY:
            raise HTTPException(status_code=500, detail="TRIPO_KEY not configured.")
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.get(
                f"https://api.tripo3d.ai/v2/openapi/task/{task_id}",
                headers={"Authorization": f"Bearer {TRIPO_KEY}"},
            )
            if not res.is_success:
                raise HTTPException(status_code=res.status_code, detail="Failed to fetch Tripo3D task status.")
            data = res.json().get("data", {})
            status = data.get("status")
            result = {"status": status, "progress": f"{data.get('progress', 0)}%"}
            if status == "success":
                model_url = data.get("output", {}).get("model") or data.get("result", {}).get("model", {}).get("url")
                result["model_url"] = model_url
                result["status"] = "completed"
            return result

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")
