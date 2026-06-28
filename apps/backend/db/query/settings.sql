-- name: CreateSettings :one
INSERT INTO settings (user_id, theme, auto_save, notifications_enabled)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetSettingsByUserID :one
SELECT * FROM settings WHERE user_id = $1;

-- name: UpdateSettings :one
UPDATE settings
SET
    theme                 = $2,
    auto_save             = $3,
    notifications_enabled = $4,
    updated_at            = NOW()
WHERE user_id = $1
RETURNING *;
