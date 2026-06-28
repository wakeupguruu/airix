-- name: CreateWorkspace :one
INSERT INTO workspaces (user_id, name, type, status, scene_json)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetWorkspaceByID :one
SELECT * FROM workspaces WHERE id = $1;

-- name: GetRecentWorkspaces :many
-- Used on the workspace dashboard — shows the 10 most recent, no filters
SELECT * FROM workspaces
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2;

-- name: GetWorkspacesFiltered :many
-- Used on the library page — all filters optional, server-side pagination
SELECT * FROM workspaces
WHERE user_id = sqlc.arg('user_id')
  AND (sqlc.narg('type')::TEXT    IS NULL OR type   = sqlc.narg('type')::TEXT)
  AND (sqlc.narg('status')::TEXT  IS NULL OR status = sqlc.narg('status')::TEXT)
  AND (sqlc.narg('search')::TEXT  IS NULL OR name   ILIKE '%' || sqlc.narg('search')::TEXT || '%')
ORDER BY created_at DESC
LIMIT  sqlc.arg('limit_val')
OFFSET sqlc.arg('offset_val');

-- name: CountWorkspacesFiltered :one
-- Needed for pagination: total count with same filters as GetWorkspacesFiltered
SELECT COUNT(*) FROM workspaces
WHERE user_id = sqlc.arg('user_id')
  AND (sqlc.narg('type')::TEXT    IS NULL OR type   = sqlc.narg('type')::TEXT)
  AND (sqlc.narg('status')::TEXT  IS NULL OR status = sqlc.narg('status')::TEXT)
  AND (sqlc.narg('search')::TEXT  IS NULL OR name   ILIKE '%' || sqlc.narg('search')::TEXT || '%');

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
