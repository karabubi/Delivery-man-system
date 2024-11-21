
DROP TABLE IF EXISTS deliveries CASCADE;

CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,                    -- Auto-incrementing delivery ID
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- Foreign key linking deliveries to a user
    address VARCHAR(255) NOT NULL,            -- Delivery address
    position_latitude FLOAT,                  -- Latitude of delivery location (optional for mapping)
    position_longitude FLOAT,                 -- Longitude of delivery location (optional for mapping)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the delivery was added
);


-- Add a new delivery for a logged-in user
INSERT INTO deliveries (user_id, address, position_latitude, position_longitude)
VALUES (1, '123 Main St', 51.5074, -0.1278);  -- Example user_id and delivery address


-- Get all deliveries for a user
SELECT id, address, position_latitude, position_longitude, created_at
FROM deliveries
WHERE user_id = 1;

---- Delete a delivery by its ID
--DELETE FROM deliveries
--WHERE id = 1 AND user_id = 1;  -- Ensure only the logged-in user can delete their deliveries
