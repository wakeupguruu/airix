CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    username       TEXT        UNIQUE NOT NULL,
    full_name      TEXT,
    email          TEXT        UNIQUE NOT NULL,
    contact_number TEXT,
    password       TEXT,
    google_id      TEXT,
    profile_image  TEXT,
    plan           TEXT        NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT require_auth CHECK (password IS NOT NULL OR google_id IS NOT NULL)
);