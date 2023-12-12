INSERT INTO Friendship_invitations (sender_id, reciever_id, created_at, updated_at)
SELECT 
  (SELECT id FROM Users WHERE account = 'user1') AS sender_id,
  (SELECT id FROM Users WHERE account = 'user2') AS reciever_id,
  CURRENT_TIMESTAMP AS created_at,
  CURRENT_TIMESTAMP AS updated_at
UNION ALL
SELECT 
  (SELECT id FROM Users WHERE account = 'user3') AS sender_id,
  (SELECT id FROM Users WHERE account = 'user1') AS reciever_id,
  CURRENT_TIMESTAMP AS created_at,
  CURRENT_TIMESTAMP AS updated_at;