-- SQL Commands for create-gender
CREATE TABLE Genders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- SQL Commands for add-gender-id-to-user
ALTER TABLE Users
ADD COLUMN gender_id INT,
ADD CONSTRAINT fk_users_gender_id FOREIGN KEY (gender_id) REFERENCES Genders(id);

