CREATE TABLE workspace_models (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         TEXT,
    s3_url       TEXT        NOT NULL,
    source       TEXT        NOT NULL CHECK (source IN ('manual', 'image_to_model', 'text_to_model', 'concept_studio')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
