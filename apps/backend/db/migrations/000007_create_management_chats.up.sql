CREATE TABLE management_chats (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    management_id     UUID        NOT NULL REFERENCES management(id) ON DELETE CASCADE,
    user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role              TEXT        NOT NULL CHECK (role IN ('user', 'ai')),
    type              TEXT        NOT NULL CHECK (type IN ('chat', 'analysis')),
    content           TEXT        NOT NULL DEFAULT '',
    status            TEXT        CHECK (status IN ('pending', 'processing', 'done', 'failed')),
    analysis_snapshot JSONB,
    attachment_url    TEXT,
    attachment_text   TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
