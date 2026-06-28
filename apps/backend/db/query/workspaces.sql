-- name: CreateWorkspace :one
INSERT INTO workspaces (user_id, name, type, status, scene_json)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetWorkspaceByID :one
SELECT * FROM workspaces WHERE id = $1;

-- name: GetWorkspacesByUserID :many
SELECT * FROM workspaces
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: UpdateWorkspace :one
UPDATE workspaces
SET
    name       = $2,
    status     = $3,
    scene_json = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteWorkspace :exec
DELETE FROM workspaces WHERE id = $1;
