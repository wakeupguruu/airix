CREATE TABLE management (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT        NOT NULL,
    description     TEXT,
    type            TEXT        NOT NULL CHECK (type IN ('DRONE', 'AIRCRAFT', 'FIGHTER_JET', 'OTHER')),
    image_url       TEXT,
    sensor_data     JSONB,
    analysis_result JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
