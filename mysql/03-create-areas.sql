-- SQL Commands for create-areas
CREATE TABLE Areas (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- SQL Commands for add-area-id-to-district
ALTER TABLE Districts
ADD COLUMN area_id INT,
ADD CONSTRAINT fk_districts_area_id FOREIGN KEY (area_id) REFERENCES Areas(id);

