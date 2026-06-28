-- name: CreateManagement :one
INSERT INTO management (user_id, name, description, type, image_url, sensor_data)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetManagementByID :one
SELECT * FROM management WHERE id = $1;

-- name: GetManagementsFiltered :many
SELECT * FROM management
WHERE user_id = sqlc.arg('user_id')
  AND (sqlc.narg('type')::TEXT   IS NULL OR type = sqlc.narg('type')::TEXT)
  AND (sqlc.narg('search')::TEXT IS NULL OR name ILIKE '%' || sqlc.narg('search')::TEXT || '%')
ORDER BY created_at DESC
LIMIT  sqlc.arg('limit_val')
OFFSET sqlc.arg('offset_val');

-- name: CountManagementsFiltered :one
SELECT COUNT(*) FROM management
WHERE user_id = sqlc.arg('user_id')
  AND (sqlc.narg('type')::TEXT   IS NULL OR type = sqlc.narg('type')::TEXT)
  AND (sqlc.narg('search')::TEXT IS NULL OR name ILIKE '%' || sqlc.narg('search')::TEXT || '%');

-- name: UpdateManagement :one
UPDATE management
SET
    name        = $2,
    description = $3,
    image_url   = $4,
    updated_at  = NOW()
WHERE id = $1
RETURNING *;

-- name: UpdateManagementAnalysis :one
UPDATE management
SET
    sensor_data     = $2,
    analysis_result = $3,
    updated_at      = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteManagement :exec
DELETE FROM management WHERE id = $1;
