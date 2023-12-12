INSERT INTO Owned_interests (interest_id, user_id, created_at, updated_at)
SELECT 
    (SELECT id FROM Interests WHERE name = '健身') AS interest_id,
    (SELECT id FROM Users WHERE account = 'user1') AS user_id,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at
UNION ALL
SELECT 
    (SELECT id FROM Interests WHERE name = '電影') AS interest_id,
    (SELECT id FROM Users WHERE account = 'user2') AS user_id,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at
UNION ALL
SELECT 
    (SELECT id FROM Interests WHERE name = '搖滾樂') AS interest_id,
    (SELECT id FROM Users WHERE account = 'user3') AS user_id,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at;