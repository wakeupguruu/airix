-- name: CreateWorkspaceChat :one
INSERT INTO workspace_chats (workspace_id, user_id, role, type, content, image_url, model_snapshot, job_id, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: GetWorkspaceChatsByWorkspaceID :many
SELECT * FROM workspace_chats
WHERE workspace_id = $1
ORDER BY created_at ASC;

-- name: UpdateWorkspaceChatStatus :one
UPDATE workspace_chats
SET
    status          = $2,
    content         = $3,
    result_model_id = $4
WHERE id = $1
RETURNING *;
