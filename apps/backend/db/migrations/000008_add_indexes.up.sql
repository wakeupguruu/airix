-- With pg_trgm, Postgres breaks the string into 3-char chunks (tri-grams) and indexes them.
-- Then '%rocket%' → trigrams {roc, ock, cke, ket} → index lookup → fast.
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- workspaces
-- Queries: GetRecentWorkspaces, GetWorkspacesFiltered, CountWorkspacesFiltered


CREATE INDEX idx_workspaces_user_created ON workspaces (user_id, created_at DESC);
CREATE INDEX idx_workspaces_type ON workspaces (type);
CREATE INDEX idx_workspaces_status ON workspaces (status);

CREATE INDEX idx_workspaces_name_trgm ON workspaces USING GIN (name gin_trgm_ops);

-- workspace_models
-- Query: GetWorkspaceModelsByWorkspaceID

CREATE INDEX idx_workspace_models_workspace_created ON workspace_models (workspace_id, created_at DESC);


-- workspace_chats
-- Query: GetWorkspaceChatsByWorkspaceID
CREATE INDEX idx_workspace_chats_workspace_created ON workspace_chats (workspace_id, created_at ASC);


-- management
-- Queries: GetManagementsFiltered, CountManagementsFiltered


CREATE INDEX idx_management_user_created ON management (user_id, created_at DESC);
CREATE INDEX idx_management_type ON management (type);
CREATE INDEX idx_management_name_trgm ON management USING GIN (name gin_trgm_ops);

-- management_chats
-- Query: GetManagementChatsByManagementID

CREATE INDEX idx_management_chats_mgmt_created ON management_chats (management_id, created_at ASC);
