
DROP TABLE IF EXISTS locations CASCADE;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL
);

-- Insert the data

-- Select all data from locations table
--SELECT * FROM locations;
SELECT latitude, longitude FROM locations;