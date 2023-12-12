-- SQL Commands for create-group-chats
CREATE TABLE Group_chats (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- SQL Commands for add-user-id-to-group-chats
ALTER TABLE Group_chats
ADD COLUMN user_id INT,
ADD CONSTRAINT fk_goup_chats_user_id FOREIGN KEY (user_id) REFERENCES Users(id);

