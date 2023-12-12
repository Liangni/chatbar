INSERT INTO Private_messages (sender_id, reciever_id, content, created_at, updated_at)
SELECT 
    (SELECT id FROM Users WHERE account = 'user2') AS sender_id,
    (SELECT id FROM Users WHERE account = 'user3') AS reciever_id,
    CONCAT('Random sentence ', FLOOR(RAND() * 1000)) AS content,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at
UNION ALL
SELECT 
    (SELECT id FROM Users WHERE account = 'user3') AS sender_id,
    (SELECT id FROM Users WHERE account = 'user2') AS reciever_id,
    CONCAT('Random sentence ', FLOOR(RAND() * 1000)) AS content,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at;