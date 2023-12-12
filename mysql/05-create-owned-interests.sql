CREATE TABLE Owned_insterests (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    interest_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);