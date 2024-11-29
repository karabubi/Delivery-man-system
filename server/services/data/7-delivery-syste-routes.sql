-- Create Routes Table for storing route information
DROP TABLE IF EXISTS routes CASCADE;
CREATE TABLE routes (
   id SERIAL PRIMARY KEY,
   distance FLOAT NOT NULL,
   duration FLOAT NOT NULL,
   geometry GEOMETRY(Geometry, 4326),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
