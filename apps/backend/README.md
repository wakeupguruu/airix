# Airix — Backend

Go REST API powering Airix. Built with Chi, pgx, sqlc, and golang-migrate.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Go | 1.22+ | https://go.dev/dl |
| PostgreSQL | 15+ | https://postgresql.org |
| `migrate` CLI | latest | `go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest` |
| `air` | latest | `go install github.com/air-verse/air@latest` |

---

## Environment Setup

```bash
cp .env.example .env
```

Fill in `.env`:

```env
PORT=8080
DATABASE_URL=postgres://<user>:<password>@localhost:5432/airix?sslmode=disable
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

---

## Database Setup

```bash
# 1. Create the database
psql -U postgres -c "CREATE DATABASE airix;"

# 2. Run all migrations
migrate -path db/migrations -database "postgres://<user>:<password>@localhost:5432/airix?sslmode=disable" up
```

---

## Local Development

```bash
# Install dependencies
go mod download

# Start with hot reload
air
```

Server runs at `http://localhost:8080`  
Health check: `GET /api/v1/health` → `{"status":"ok"}`

---

## After Schema or Query Changes

```bash
sqlc generate
```

> Never edit files inside `internal/db/` — they are auto-generated.

---

## Project Structure

```
apps/backend/
├── cmd/server/main.go          # Entry point
├── internal/
│   ├── auth/                   # JWT + middleware
│   ├── config/                 # DB connection
│   ├── db/                     # sqlc generated — DO NOT EDIT
│   ├── handlers/               # HTTP handlers
│   ├── routes/                 # Route registration
│   └── utils/                  # Response helpers, validation
├── db/
│   ├── migrations/             # SQL migration files
│   └── query/                  # sqlc source queries
├── sqlc.yaml
└── .env
```
