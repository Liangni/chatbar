INSERT INTO Group_registers (group_id, user_id, created_at, updated_at)
SELECT 
  GC.id AS group_id,
  U.id AS user_id,
  CURRENT_TIMESTAMP AS created_at,
  CURRENT_TIMESTAMP AS updated_at
FROM 
  Group_chats AS GC
  CROSS JOIN Users AS U;