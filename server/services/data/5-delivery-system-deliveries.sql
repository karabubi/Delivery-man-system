-- Drop the table if it exists to ensure a clean slate
DROP TABLE IF EXISTS deliveries CASCADE;

-- Create the deliveries table
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,                     -- Auto-incrementing delivery ID
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- Foreign key linking deliveries to a user
    address VARCHAR(255) NOT NULL,             -- Delivery address
    position_latitude FLOAT,                   -- Latitude of delivery location (optional for mapping)
    position_longitude FLOAT,                  -- Longitude of delivery location (optional for mapping)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the delivery was added
);

-- Add deliveries for a logged-in user
INSERT INTO deliveries (user_id, address, position_latitude, position_longitude)
VALUES 
    (1, 'Adenauerallee 1', 50.73743, 7.098206),
    (1, 'Belderberg 2', 50.735887, 7.101445),
    (1, 'Breite Straße 3', 50.733134, 7.101786),
    (1, 'Clemens-August-Straße 4', 50.731244, 7.103915),
    (1, 'Heerstraße 5', 50.733892, 7.103623),
    (1, 'Römerstraße 6', 50.732895, 7.099423),
    (1, 'Maxstraße 7', 50.734671, 7.097592),
    (1, 'Beethovenplatz 8', 50.735982, 7.101354),
    (1, 'Friedrichstraße 9', 50.734545, 7.098921),
    (1, 'Kaiserstraße 10', 50.732756, 7.100991),
    (1, 'Münsterstraße 11', 50.734206, 7.097312),
    (1, 'Am Hofgarten 12', 50.735573, 7.100321),
    (1, 'Beringstraße 13', 50.736845, 7.102015),
    (1, 'Baumschulallee 14', 50.732456, 7.094986),
    (1, 'Poppelsdorfer Allee 15', 50.733784, 7.094293),
    (1, 'Kaiserplatz 16', 50.733564, 7.100876),
    (1, 'Sandkaule 17', 50.735263, 7.098235),
    (1, 'Quantiusstraße 18', 50.730465, 7.097654),
    (1, 'Welschnonnenstraße 19', 50.732345, 7.099087),
    (1, 'Koblenzer Straße 20', 50.726112, 7.093218),
    (1, 'Viktoriabrücke 21', 50.736982, 7.095384),
    (1, 'Endenicher Straße 22', 50.735482, 7.091673),
    (1, 'Kennedyallee 23', 50.725682, 7.114271),
    (1, 'Willy-Brandt-Allee 24', 50.720167, 7.120873),
    (1, 'Augustusring 25', 50.731485, 7.099645),
    (1, 'Bottlerplatz 26', 50.735812, 7.097351),
    (1, 'Bonnstraße 27', 50.724917, 7.110921),
    (1, 'Am Michaelshof 28', 50.734217, 7.096112),
    (1, 'Brüdergasse 29', 50.735054, 7.099217),
    (1, 'Kölnstraße 30', 50.733561, 7.093254),
    (1, 'Dorotheenstraße 31', 50.731982, 7.098542),
    (1, 'Bonngasse 32', 50.735928, 7.099328),
    (1, 'Markt 33', 50.735612, 7.099127),
    (1, 'Am Hofgarten 34', 50.735192, 7.100231),
    (1, 'Sternstraße 35', 50.736194, 7.098321),
    (1, 'Breite Straße 36', 50.733821, 7.102321),
    (1, 'Am Botanischen Garten 37', 50.733567, 7.095145),
    (1, 'Thomas-Mann-Straße 38', 50.734961, 7.103251),
    (1, 'Noeggerathstraße 39', 50.732546, 7.094283),
    (1, 'Langer Grabenweg 40', 50.729345, 7.097671),
    (1, 'Moltkestraße 41', 50.730756, 7.094365),
    (1, 'Prinz-Albert-Straße 42', 50.731234, 7.099815),
    (1, 'Weberstraße 43', 50.734213, 7.096128),
    (1, 'Im Krausfeld 44', 50.735634, 7.095624),
    (1, 'Argelanderstraße 45', 50.733258, 7.094762),
    (1, 'Sternenhof 46', 50.736284, 7.099283),
    (1, 'Rathausgasse 47', 50.735923, 7.098423),
    (1, 'Josefstraße 48', 50.731562, 7.095761),
    (1, 'Am Hof 49', 50.735873, 7.099812),
    (1, 'Brüderstraße 50', 50.735341, 7.099124),
    (1, 'Charlottenburg Palace', 52.520606, 13.295379),
    (1, 'Berliner Dom', 52.519167, 13.401594),
    (1, 'Tiergarten', 52.514394, 13.359162),
    (1, 'Gendarmenmarkt', 52.513674, 13.3925),
    (1, 'Kurfürstendamm', 52.507798, 13.331153),
    (1, 'Olympiastadion', 52.514568, 13.290158),
    (1, 'Schloss Bellevue', 52.514344, 13.310579),
    (1, 'Charlottenburg', 52.520273, 13.295379),
    (1, 'Unter den Linden', 52.514678, 13.391336),
    (1, 'Siegessäule', 52.514404, 13.350297),
    (1, 'Tempelhofer Feld', 52.474604, 13.402671),
    (1, 'Bebelplatz', 52.517273, 13.393272),
    (1, 'Berlin Hauptbahnhof', 52.525687, 13.369467),
    (1, 'Berlin Zoo', 52.508404, 13.338036);

-- Select all data from the deliveries table
SELECT * FROM deliveries;

-- Select the latitude and longitude from the deliveries table
SELECT position_latitude, position_longitude FROM deliveries;
