CREATE TABLE workspaces (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT        NOT NULL,
    type       TEXT        NOT NULL CHECK (type IN ('blank', 'image_to_model', 'text_to_model', 'concept_studio')),
    status     TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete')),
    scene_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);