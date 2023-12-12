INSERT INTO Group_chats (name, user_id, created_at, updated_at)
VALUES 
  ('groupChat1', (SELECT id FROM Users WHERE account = 'user1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('groupChat2', (SELECT id FROM Users WHERE account = 'user1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('groupChat3', (SELECT id FROM Users WHERE account = 'user1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);