CREATE TABLE Users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    account VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    occupation VARCHAR(255),
    avatar VARCHAR(255),
    intro TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
