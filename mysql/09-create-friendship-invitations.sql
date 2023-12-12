-- SQL Commands for create-friendship-invitation
CREATE TABLE Friendship_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    reciever_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);