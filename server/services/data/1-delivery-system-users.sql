

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,               -- Auto-incrementing user ID
    username VARCHAR(255) NOT NULL,      -- User's username
    email VARCHAR(255) NOT NULL UNIQUE,  -- User's email
    password VARCHAR(255) NOT NULL,      -- User's password (hashed)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Account creation time
);


-- Register a new user
INSERT INTO users (username, email, password)
VALUES ('new_user', 'user@example.com', 'hashed_password');


-- Check user credentials for login
SELECT id, username, password
FROM users
WHERE username = 'user_input' OR email = 'user_input';
