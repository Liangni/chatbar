CREATE TABLE Private_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    reciever_id INT NOT NULL,
    content TEXT,
    file VARCHAR(255),
    image VARCHAR(255),
    image_src VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_private_messages_sender_id FOREIGN KEY (sender_id) REFERENCES Users(id),
    CONSTRAINT fk_private_messages_reciever_id FOREIGN KEY (reciever_id) REFERENCES Users(id)
);