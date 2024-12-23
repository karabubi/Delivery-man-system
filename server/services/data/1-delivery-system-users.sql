-- Drop the users table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Auto-incrementing user ID
    name VARCHAR(255) NOT NULL, -- User's name
    email VARCHAR(255) UNIQUE NOT NULL -- User's email
);
-- Insert a user to reference in the deliveries table
INSERT INTO users (name, email)
VALUES ('saleh Alkarabubi', 'karabubi66@yahoo.com');


-- Verify the user is inserted
SELECT * FROM users;