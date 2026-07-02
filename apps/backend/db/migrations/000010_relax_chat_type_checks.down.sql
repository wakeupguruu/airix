ALTER TABLE workspace_chats DROP CONSTRAINT workspace_chats_role_check;
ALTER TABLE workspace_chats ADD CONSTRAINT workspace_chats_role_check
    CHECK (role IN ('user', 'ai'));

ALTER TABLE workspace_chats DROP CONSTRAINT workspace_chats_type_check;
ALTER TABLE workspace_chats ADD CONSTRAINT workspace_chats_type_check
    CHECK (type IN ('chat', 'text_to_model', 'image_to_model'));

ALTER TABLE management_chats DROP CONSTRAINT management_chats_role_check;
ALTER TABLE management_chats ADD CONSTRAINT management_chats_role_check
    CHECK (role IN ('user', 'ai'));

ALTER TABLE management_chats DROP CONSTRAINT management_chats_type_check;
ALTER TABLE management_chats ADD CONSTRAINT management_chats_type_check
    CHECK (type IN ('chat', 'analysis'));
