-- name: CreateWorkspaceModel :one
INSERT INTO workspace_models (workspace_id, user_id, name, s3_url, source)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetWorkspaceModelByID :one
SELECT * FROM workspace_models WHERE id = $1;

-- name: GetWorkspaceModelsByWorkspaceID :many
SELECT * FROM workspace_models
WHERE workspace_id = $1
ORDER BY created_at DESC;

-- name: DeleteWorkspaceModel :exec
DELETE FROM workspace_models WHERE id = $1;
