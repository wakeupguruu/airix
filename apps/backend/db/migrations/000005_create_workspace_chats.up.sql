CREATE TABLE workspace_chats (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            TEXT        NOT NULL CHECK (role IN ('user', 'ai')),
    type            TEXT        NOT NULL CHECK (type IN ('chat', 'text_to_model', 'image_to_model')),
    content         TEXT        NOT NULL DEFAULT '',
    image_url       TEXT,
    model_snapshot  JSONB,
    job_id          TEXT,
    result_model_id UUID        REFERENCES workspace_models(id) ON DELETE SET NULL,
    status          TEXT        CHECK (status IN ('pending', 'processing', 'done', 'failed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
