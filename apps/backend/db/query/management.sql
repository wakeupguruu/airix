-- name: CreateManagement :one
INSERT INTO management (user_id, name, description, type, image_url, sensor_data)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetManagementByID :one
SELECT * FROM management WHERE id = $1;

-- name: GetManagementsByUserID :many
SELECT * FROM management
WHERE user_id = $1
ORDER BY created_at DESC;

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
