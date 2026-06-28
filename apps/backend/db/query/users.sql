-- name: CreateUser :one
INSERT INTO users (username, full_name, email, contact_number, password, google_id, profile_image, plan)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: UpdateUser :one
UPDATE users
SET
    full_name      = $2,
    contact_number = $3,
    profile_image  = $4,
    updated_at     = NOW()
WHERE id = $1
RETURNING *;

-- name: UpdateUserPlan :one
UPDATE users
SET
    plan       = $2,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: UpdateUserPassword :exec
UPDATE users
SET
    password   = $2,
    updated_at = NOW()
WHERE id = $1;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;
