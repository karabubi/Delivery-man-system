-- Drop the deliveries table if it exists
DROP TABLE IF EXISTS deliveries CASCADE;


-- Create the deliveries table
CREATE TABLE deliveries (
   id SERIAL PRIMARY KEY, 
  user_id VARCHAR(255),
   address VARCHAR(255) NOT NULL,

   position_latitude FLOAT, 
   position_longitude FLOAT, 
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


-- Select all data from the deliveries table
SELECT * FROM deliveries;

-- Select the latitude and longitude from the deliveries table
SELECT position_latitude, position_longitude FROM deliveries;

-- Run this SQL query to list constraints
SELECT conname
FROM pg_constraint
WHERE conrelid = 'deliveries'::regclass;