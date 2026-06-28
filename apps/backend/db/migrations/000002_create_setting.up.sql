CREATE TABLE settings (
    id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme                  TEXT        NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    auto_save              BOOLEAN     NOT NULL DEFAULT true,
    notifications_enabled  BOOLEAN     NOT NULL DEFAULT true,
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
