-- name: CreateManagementChat :one
INSERT INTO management_chats (management_id, user_id, role, type, content, status, attachment_url, attachment_text)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: GetManagementChatsByManagementID :many
SELECT * FROM management_chats
WHERE management_id = $1
ORDER BY created_at ASC;

-- name: UpdateManagementChatStatus :one
UPDATE management_chats
SET
    status            = $2,
    content           = $3,
    analysis_snapshot = $4
WHERE id = $1
RETURNING *;
