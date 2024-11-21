

DROP TABLE IF EXISTS edges CASCADE;
-- Creating the 'edges' table with source, target, and cost information for the road network
CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    source INT REFERENCES vertices(id) ON DELETE CASCADE,  -- Source vertex, with cascading delete
    target INT REFERENCES vertices(id) ON DELETE CASCADE,  -- Target vertex, with cascading delete
    cost FLOAT NOT NULL,  -- Cost (e.g., distance or time to travel)
    reverse_cost FLOAT NOT NULL,  -- Reverse cost (distance or time in the opposite direction)
    CONSTRAINT unique_edge UNIQUE (source, target)  -- Ensure no duplicate edges between the same pair of vertices
);

-- Inserting edge data into the 'edges' table, calculating distances dynamically using ST_Distance
INSERT INTO edges (source, target, cost, reverse_cost)
VALUES
    -- Edge between vertex 1 and vertex 2
    (1, 2, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 1),
        (SELECT geom FROM vertices WHERE id = 2)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 2),
        (SELECT geom FROM vertices WHERE id = 1)
    )),

    -- Edge between vertex 2 and vertex 3
    (2, 3, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 2),
        (SELECT geom FROM vertices WHERE id = 3)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 3),
        (SELECT geom FROM vertices WHERE id = 2)
    )),

    -- Edge between vertex 3 and vertex 4
    (3, 4, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 3),
        (SELECT geom FROM vertices WHERE id = 4)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 4),
        (SELECT geom FROM vertices WHERE id = 3)
    )),

    -- Edge between vertex 4 and vertex 5
    (4, 5, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 4),
        (SELECT geom FROM vertices WHERE id = 5)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 5),
        (SELECT geom FROM vertices WHERE id = 4)
    )),

    -- Edge between vertex 5 and vertex 6
    (5, 6, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 5),
        (SELECT geom FROM vertices WHERE id = 6)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 6),
        (SELECT geom FROM vertices WHERE id = 5)
    )),

    -- Edge between vertex 6 and vertex 7
    (6, 7, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 6),
        (SELECT geom FROM vertices WHERE id = 7)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 7),
        (SELECT geom FROM vertices WHERE id = 6)
    )),

    -- Edge between vertex 7 and vertex 8
    (7, 8, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 7),
        (SELECT geom FROM vertices WHERE id = 8)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 8),
        (SELECT geom FROM vertices WHERE id = 7)
    )),

    -- Edge between vertex 8 and vertex 9
    (8, 9, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 8),
        (SELECT geom FROM vertices WHERE id = 9)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 9),
        (SELECT geom FROM vertices WHERE id = 8)
    )),

    -- Edge between vertex 9 and vertex 10
    (9, 10, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 9),
        (SELECT geom FROM vertices WHERE id = 10)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 10),
        (SELECT geom FROM vertices WHERE id = 9)
    )),

    -- Add more edges for the remaining pairs as necessary...
    -- (Repeat the same pattern for all vertex pairs)

    -- Example of last edge
    (49, 50, ST_Distance(
        (SELECT geom FROM vertices WHERE id = 49),
        (SELECT geom FROM vertices WHERE id = 50)
    ),
    ST_Distance(
        (SELECT geom FROM vertices WHERE id = 50),
        (SELECT geom FROM vertices WHERE id = 49)
    ));
