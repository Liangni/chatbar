-- SQL Commands for create-group-messages
CREATE TABLE Group_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    file VARCHAR(255),
    image VARCHAR(255),
    image_src VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- SQL Commands for add-user-id-to-group-messages
ALTER TABLE Group_messages
ADD COLUMN user_id INT,
ADD CONSTRAINT fk_group_messages_user_id FOREIGN KEY (user_id) REFERENCES Users(id);

-- SQL Commands for add-group-id-to-group-messages
ALTER TABLE Group_messages
ADD COLUMN group_id INT,
ADD CONSTRAINT fk_group_messages_group_id FOREIGN KEY (group_id) REFERENCES Group_chats(id);

