-- SQL Commands for create-districts
CREATE TABLE Districts (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- SQL Commands for add-district-id-to-user
ALTER TABLE Users
ADD COLUMN district_id INT,
ADD CONSTRAINT fk_users_district_id FOREIGN KEY (district_id) REFERENCES Districts(id);

