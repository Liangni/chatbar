INSERT INTO Group_messages (group_id, user_id, content, created_at, updated_at)
SELECT 
    GC.id AS group_id,
    U.id AS user_id,
--   SUBSTRING(MD5(RAND()), 1, 10) AS content,
    CASE 
        WHEN RAND() < 0.33 THEN 'This is a sample sentence.'
        WHEN RAND() < 0.66 THEN 'Another example sentence.'
        ELSE 'Yet another sentence for variety.'
    END AS content,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at
FROM 
    Group_chats AS GC
    CROSS JOIN Users AS U
LIMIT 9;