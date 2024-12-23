-- Drop both tables if they exist
DROP TABLE IF EXISTS deliveries CASCADE;


-- Create the deliveries table
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    --user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES,
    address VARCHAR(255) NOT NULL,
    position_latitude FLOAT,
    position_longitude FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data into the deliveries table
INSERT INTO deliveries (user_id, address, position_latitude, position_longitude)
VALUES 
--SELECT * FROM information_schema.tables WHERE table_name = 'users';

SELECT * FROM information_schema.tables WHERE table_name = 'deliveries';

SELECT conname, confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'deliveries'::regclass AND contype = 'f';
