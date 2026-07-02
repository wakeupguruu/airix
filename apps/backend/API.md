# Airix API Reference

Base URL: `http://localhost:8080/api/v1`

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

All responses follow this envelope:
```json
{ "data": ... }          // success
{ "error": "message" }   // failure
```

---

## Auth

### POST `/auth/register`
Create a new account.

**Body**
```json
{
  "username": "tanveer",
  "email": "tanveer@gmail.com",
  "password": "mypassword123"
}
```

**Response `201`**
```json
{
  "user": {
    "id": "uuid",
    "username": "tanveer",
    "email": "tanveer@gmail.com",
    "full_name": null,
    "contact_number": null,
    "google_id": null,
    "profile_image": null,
    "plan": "starter",
    "created_at": "...",
    "updated_at": "..."
  },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

**Errors**
- `400` — email or username already exists, invalid body
- `500` — server error

---

### POST `/auth/login`
Sign in with email and password.

**Body**
```json
{
  "email": "tanveer@gmail.com",
  "password": "mypassword123"
}
```

**Response `200`** — same shape as register response.

**Errors**
- `401` — wrong password
- `404` — email not found

---

### POST `/auth/refresh`
Get a new access token using a refresh token.

**Body**
```json
{
  "refresh_token": "eyJ..."
}
```

**Response `200`**
```json
{
  "access_token": "eyJ..."
}
```

**Errors**
- `401` — invalid or expired refresh token

---

### POST `/auth/forgot-password`
Send a 6-digit OTP to the user's email. OTP expires in 15 minutes.

**Body**
```json
{
  "email": "tanveer@gmail.com"
}
```

**Response `200`** — always returns success even if email doesn't exist (security).
```json
{
  "message": "If this email is registered, an OTP has been sent."
}
```

---

### POST `/auth/reset-password`
Set a new password using the OTP received by email.

**Body**
```json
{
  "email": "tanveer@gmail.com",
  "otp": "483920",
  "new_password": "newpassword456"
}
```

**Response `200`**
```json
{
  "message": "Password updated successfully"
}
```

**Errors**
- `400` — OTP expired or invalid
- `401` — OTP mismatch

---

## User

### GET `/users/me` 🔒
Get the logged-in user's profile.

**Response `200`**
```json
{
  "id": "uuid",
  "username": "tanveer",
  "email": "tanveer@gmail.com",
  "full_name": { "String": "Tanveer Singh", "Valid": true },
  "contact_number": { "String": "+91 9999999999", "Valid": true },
  "google_id": { "String": "", "Valid": false },
  "profile_image": { "String": "https://bucket.s3.region.amazonaws.com/...", "Valid": true },
  "plan": "starter",
  "created_at": "...",
  "updated_at": "..."
}
```

---

### PATCH `/users/me` 🔒
Update profile fields.

**Body** (all fields optional)
```json
{
  "full_name": "Tanveer Singh",
  "contact_number": "+91 9999999999"
}
```

**Response `200`** — updated user (same shape as GET).

---

### POST `/users/me/avatar` 🔒
Upload a profile photo. Sends as `multipart/form-data`. Old photo is automatically deleted from S3.

**Form fields**
| Field | Type | Required |
|---|---|---|
| `avatar` | File | Yes |

Accepted formats: `.jpg`, `.png`, `.webp`  
Max size: `10MB`

**Response `200`** — updated user with new `profile_image` URL.

**Errors**
- `400` — wrong file type, file too large, missing field
- `500` — S3 upload failed

---

## Settings

### GET `/users/me/settings` 🔒
Get user's app preferences. Creates defaults if settings don't exist yet.

**Response `200`**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "theme": "system",
  "auto_save": true,
  "notifications_enabled": true,
  "updated_at": "..."
}
```

---

### PUT `/users/me/settings` 🔒
Update preferences.

**Body**
```json
{
  "theme": "dark",
  "auto_save": false,
  "notifications_enabled": true
}
```

Valid themes: `light`, `dark`, `system`

**Response `200`** — updated settings.

---

## Workspaces

### POST `/workspaces` 🔒
Create a new workspace.

**Body**
```json
{
  "name": "Fighter Jet Concept",
  "type": "text_to_model"
}
```

Valid types: `blank` | `image_to_model` | `text_to_model` | `concept_studio`

**Response `201`**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Fighter Jet Concept",
  "type": "text_to_model",
  "status": "draft",
  "scene_json": null,
  "created_at": "...",
  "updated_at": "..."
}
```

---

### GET `/workspaces` 🔒
List workspaces with optional filters. All query params are optional.

**Query params**
| Param | Type | Description |
|---|---|---|
| `type` | string | Filter by type |
| `status` | string | Filter by status |
| `search` | string | Search by name (case-insensitive) |

Default: page 1, 20 items per page.

**Response `200`**
```json
{
  "workspaces": [ ...workspace objects... ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### GET `/workspaces/{id}` 🔒
Get a single workspace by ID. Returns `403` if you don't own it.

**Response `200`** — workspace object.

---

### PATCH `/workspaces/{id}` 🔒
Update a workspace. Used to save the 3D scene state.

**Body** (all fields optional)
```json
{
  "name": "Updated Name",
  "status": "in_progress",
  "scene_json": {
    "objects": [...]
  }
}
```

Valid statuses: `draft` | `in_progress` | `complete`

**Response `200`** — updated workspace.

---

### DELETE `/workspaces/{id}` 🔒
Delete a workspace. Cascades to all chats and models.

**Response `200`**
```json
{ "message": "workspace deleted" }
```

---

### GET `/workspaces/{id}/chats` 🔒
Get the full conversation history for a workspace, ordered oldest to newest.

**Response `200`**
```json
[
  {
    "id": "uuid",
    "workspace_id": "uuid",
    "user_id": "uuid",
    "role": "user",
    "type": "text",
    "content": "Make the wings swept back",
    "image_url": null,
    "model_snapshot": null,
    "job_id": null,
    "result_model_id": null,
    "status": "done",
    "created_at": "..."
  },
  ...
]
```

---

### POST `/workspaces/{id}/chat/design` 🔒
Send a message to the AI co-engineer. AI has access to scene context and conversation history.

> Currently returns a stub response. Live AI goes through gRPC to Python backend.

**Body**
```json
{
  "prompt": "What would this fuselage weigh in aluminum 7075?",
  "scene_json": {
    "objects": [
      {
        "id": "fuselage_01",
        "type": "component",
        "mass_kg": 850,
        "material": "Aluminum 7075"
      }
    ]
  }
}
```

**Response `200`**
```json
{
  "user_message": { ...chat object... },
  "assistant_message": { ...chat object... }
}
```

When AI is live, `assistant_message` will have `status: "done"` and populated `content`.

---

### POST `/workspaces/{id}/generate` 🔒
Trigger 3D model generation. Creates a chat row with `status: "pending"`.

> Currently returns stub. Live: Go calls AI via gRPC → AI calls Meshy/Tripo3D → returns job_id.

**Body — text to model**
```json
{
  "mode": "text_to_model",
  "prompt": "A futuristic delta-wing fighter jet"
}
```

**Body — image to model**
```json
{
  "mode": "image_to_model",
  "image_url": "https://bucket.s3.region.amazonaws.com/airix/userid/avatar/concept.png"
}
```

Note: upload the image first via `/users/me/avatar` or a concept flow. Pass the S3 URL here.

**Response `202`**
```json
{
  "chat_id": "uuid",
  "status": "pending",
  "note": "AI backend not connected yet — stub response"
}
```

When AI is live: returns `job_id` from external provider. Poll via frontend or SSE.

---

### POST `/workspaces/{id}/concept` 🔒
Generate 4 concept images from a text prompt (Concept Studio mode).

> Currently stub. Live: AI calls image generation provider, returns 4 S3 URLs.

**Body**
```json
{
  "prompt": "A stealth drone with swept-back wings, matte black finish"
}
```

**Response `200`**
```json
{
  "images": [
    "https://s3.../concept_1.png",
    "https://s3.../concept_2.png",
    "https://s3.../concept_3.png",
    "https://s3.../concept_4.png"
  ],
  "chat_id": "uuid"
}
```

After user picks an image, pass its URL to `POST /workspaces/{id}/generate` with `mode: image_to_model`.

---

### POST `/workspaces/{id}/models/import` 🔒
Import a 3D model file from the user's local PC directly to S3.

**Form fields** (`multipart/form-data`)
| Field | Type | Required |
|---|---|---|
| `model` | File | Yes |
| `name` | string | No (defaults to filename) |

Accepted formats: `.glb`, `.obj`, `.fbx`, `.gltf`  
Max size: `100MB`

S3 path: `airix/<userID>/assets/<workspaceID>/<filename>`

**Response `201`**
```json
{
  "id": "uuid",
  "workspace_id": "uuid",
  "user_id": "uuid",
  "name": "my_jet.glb",
  "s3_url": "https://bucket.s3.region.amazonaws.com/airix/.../my_jet.glb",
  "source": "manual",
  "created_at": "..."
}
```

---

### GET `/workspaces/{id}/models` 🔒
List all 3D models in a workspace (both imported and AI-generated).

**Response `200`** — array of workspace model objects.

---

## Maintenance

### POST `/maintenance` 🔒
Register an aircraft or drone for maintenance tracking.

**Body**
```json
{
  "name": "F-22 Alpha",
  "description": "Primary test aircraft",
  "type": "FIGHTER_JET",
  "sensor_data": {
    "engine_temp": 820,
    "vibration": 0.3
  }
}
```

Valid types: `DRONE` | `AIRCRAFT` | `FIGHTER_JET` | `OTHER`

**Response `201`** — management object.

---

### GET `/maintenance` 🔒
List maintenance records with filters.

**Query params**
| Param | Type | Description |
|---|---|---|
| `type` | string | Filter by vehicle type |
| `search` | string | Search by name |

**Response `200`**
```json
{
  "managements": [ ...management objects... ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

---

### GET `/maintenance/{id}` 🔒
Get a single maintenance record.

**Response `200`**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "F-22 Alpha",
  "description": "Primary test aircraft",
  "type": "FIGHTER_JET",
  "image_url": null,
  "sensor_data": { "engine_temp": 820 },
  "analysis_result": null,
  "created_at": "...",
  "updated_at": "..."
}
```

---

### PATCH `/maintenance/{id}` 🔒
Update name or description.

**Body**
```json
{
  "name": "F-22 Alpha v2",
  "description": "Updated description"
}
```

**Response `200`** — updated management object.

---

### DELETE `/maintenance/{id}` 🔒
Delete a maintenance record.

**Response `200`**
```json
{ "message": "management record deleted" }
```

---

### GET `/maintenance/{id}/chats` 🔒
Get the full conversation history for a maintenance session.

**Response `200`** — array of management chat objects, ordered oldest first.

---

### POST `/maintenance/{id}/upload` 🔒
Upload a CSV or PDF sensor/telemetry file to S3. Creates a chat row marking the upload.

> After uploading, extract the text content from the file on your side (or let Go handle it via AWS Textract later), then pass it to `/analyse`.

**Form fields** (`multipart/form-data`)
| Field | Type | Required |
|---|---|---|
| `file` | File | Yes |

Max size: `50MB`

S3 path: `airix/<userID>/assets/<managementID>/<filename>`

**Response `201`**
```json
{
  "s3_url": "https://bucket.s3.region.amazonaws.com/airix/.../sensor_data.csv",
  "chat_id": "uuid",
  "message": "File uploaded. Pass attachment_text to /analyse after extracting CSV/PDF content."
}
```

---

### POST `/maintenance/{id}/analyse` 🔒
Run AI predictive maintenance analysis on sensor data.

> Currently returns a stub. Live: Go calls Python AI via gRPC with history + attachment text.

**Body**
```json
{
  "prompt": "Analyse this flight data and flag any critical issues",
  "attachment_text": "Timestamp,Engine_Temp,Vibration\n2024-01-15 08:00,820,0.3\n2024-01-15 08:45,940,0.8"
}
```

`attachment_text` is the raw extracted text from a CSV or PDF. You can pass the content directly from your upload step, or send it as plain text without uploading a file.

**Response `200`**
```json
{
  "user_message": { ...chat object with role: "user"... },
  "assistant_message": { ...chat object with role: "assistant", status: "pending"... }
}
```

When AI is live, `assistant_message` will have:
- `status: "done"`
- `content`: human-readable analysis text
- `analysis_snapshot`: structured JSON with risk levels, component statuses, maintenance recommendations

The backend also writes `analysis_snapshot` to `management.analysis_result` for the latest state.

---

## Error Reference

| Code | Meaning |
|---|---|
| `400` | Bad request — missing field, invalid format, failed validation |
| `401` | Unauthorized — missing or invalid JWT, wrong password, bad OTP |
| `403` | Forbidden — you don't own this resource |
| `404` | Not found |
| `500` | Server error — check server logs |
