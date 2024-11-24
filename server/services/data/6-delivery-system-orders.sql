
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    source_location INT REFERENCES locations(id),
    destination_location INT REFERENCES locations(id),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO orders (source_location, destination_location)
SELECT
    (SELECT id FROM locations WHERE address = 'Adenauerallee 1') AS source_location,
    id AS destination_location
FROM locations
WHERE address != 'Adenauerallee 1';
SELECT * FROM orders;
