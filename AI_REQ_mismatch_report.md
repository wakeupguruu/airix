# AI_REQ.md vs Current `apps/ai-backend` — Spec Mismatch Report

Source doc: `C:\Users\vyasg\Downloads\AI_REQ.md`
Checked: 2026-07-02

## Finding: Transport protocol mismatch

**Spec requires gRPC.** AI_REQ.md line 19 is explicit:

> Communication between the Go backend and the AI backend is via **gRPC** (not Redis queue, not REST).

Proto is already defined and checked into the repo — Go side is ready and waiting:

- `apps/backend/proto/ai/ai.proto`
- Service: `AIService` with 5 RPCs matching the doc's 4 feature areas:
  - `Generate(GenerateRequest) → GenerateResponse`
  - `GenerateStatus(GenerateStatusRequest) → GenerateStatusResponse`
  - `ConceptImages(ConceptImagesRequest) → ConceptImagesResponse`
  - `DesignChat(DesignChatRequest) → DesignChatResponse`
  - `MaintenanceAnalyse(MaintenanceAnalyseRequest) → MaintenanceAnalyseResponse`

**What's actually built:** `apps/ai-backend` is a pure REST/FastAPI service.

- `main.py` wires 4 routers as HTTP endpoints: `generate`, `chat`, `concept`, `maintenance`
- `requirements.txt` has no `grpcio` / `grpcio-tools` — zero gRPC code exists
- Health check endpoint (`GET /`) lists REST paths: `POST /generate`, `POST /chat/design`, `POST /chat/maintenance`, `POST /concept/images`, `POST /maintenance/analyse`, `POST /maintenance/analyse/json`

## Good news

Endpoint shapes in the REST build roughly mirror the doc's JSON examples (same field names: `prompt`, `chat_id`, `workspace_id`, `scene_json`, `attachment_text`, etc.), so the router business logic (provider calls, prompt engineering, ML analysis) is largely reusable — it's the transport layer that needs replacing, not the logic.

## What Go currently gets vs needs

| | Current (built) | Spec (required) |
|---|---|---|
| Protocol | HTTP/REST (FastAPI) | gRPC (proto-defined) |
| Contract source | ad-hoc JSON in routers | `apps/backend/proto/ai/ai.proto` (source of truth per doc) |
| Go can call it as-is? | No | N/A |

## Options

1. **Convert ai-backend to gRPC** — generate `ai_pb2.py` / `ai_pb2_grpc.py` from the proto, wrap existing router logic inside an `AIServiceServicer`, run a gRPC server (default port `50051` per `GRPC_PORT` env var) alongside or instead of the FastAPI app.
2. **Keep REST, renegotiate with Go team** — if the proto/spec is stale or the team prefers REST, confirm with whoever owns `apps/backend` before diverging further from the documented contract.

## Status

**RESOLVED 2026-07-02** — Option 1 implemented. `apps/ai-backend` now runs a gRPC
`AIService` (grpc.aio, port 50051) alongside FastAPI in one process. Stubs generated
from `apps/backend/proto/ai/ai.proto`. Go handlers wired to the live gRPC client
(`workspace.go`, `maintenance.go`, `main.go`); new `GET /workspaces/{id}/generate/status`
route added for job polling. All 5 RPCs smoke-tested live.
