-- Handlers write role='assistant' and type='text'/'file'; original checks predate them.
ALTER TABLE workspace_chats DROP CONSTRAINT workspace_chats_role_check;
ALTER TABLE workspace_chats ADD CONSTRAINT workspace_chats_role_check
    CHECK (role IN ('user', 'ai', 'assistant'));

ALTER TABLE workspace_chats DROP CONSTRAINT workspace_chats_type_check;
ALTER TABLE workspace_chats ADD CONSTRAINT workspace_chats_type_check
    CHECK (type IN ('chat', 'text', 'text_to_model', 'image_to_model', 'concept'));

ALTER TABLE management_chats DROP CONSTRAINT management_chats_role_check;
ALTER TABLE management_chats ADD CONSTRAINT management_chats_role_check
    CHECK (role IN ('user', 'ai', 'assistant'));

ALTER TABLE management_chats DROP CONSTRAINT management_chats_type_check;
ALTER TABLE management_chats ADD CONSTRAINT management_chats_type_check
    CHECK (type IN ('chat', 'analysis', 'text', 'file'));
