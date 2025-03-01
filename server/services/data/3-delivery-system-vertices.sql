
DROP TABLE IF EXISTS vertices CASCADE;
CREATE TABLE vertices (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255),  -- Store the address of the location
    geom GEOMETRY(Point, 4326)  -- Geographical coordinates (latitude, longitude) in SRID 4326 (WGS84)
);

INSERT INTO vertices (address, geom) VALUES 
('Adenauerallee 1', ST_SetSRID(ST_MakePoint(7.098206, 50.73743), 4326)),
('Belderberg 2', ST_SetSRID(ST_MakePoint(7.101445, 50.735887), 4326)),
('Breite Straße 3', ST_SetSRID(ST_MakePoint(7.101786, 50.733134), 4326)),
('Clemens-August-Straße 4', ST_SetSRID(ST_MakePoint(7.103915, 50.731244), 4326)),
('Heerstraße 5', ST_SetSRID(ST_MakePoint(7.103623, 50.733892), 4326)),
('Römerstraße 6', ST_SetSRID(ST_MakePoint(7.099423, 50.732895), 4326)),
('Maxstraße 7', ST_SetSRID(ST_MakePoint(7.097592, 50.734671), 4326)),
('Beethovenplatz 8', ST_SetSRID(ST_MakePoint(7.101354, 50.735982), 4326)),
('Friedrichstraße 9', ST_SetSRID(ST_MakePoint(7.098921, 50.734545), 4326)),
('Kaiserstraße 10', ST_SetSRID(ST_MakePoint(7.100991, 50.732756), 4326)),
('Münsterstraße 11', ST_SetSRID(ST_MakePoint(7.097312, 50.734206), 4326)),
('Am Hofgarten 12', ST_SetSRID(ST_MakePoint(7.100321, 50.735573), 4326)),
('Beringstraße 13', ST_SetSRID(ST_MakePoint(7.102015, 50.736845), 4326)),
('Baumschulallee 14', ST_SetSRID(ST_MakePoint(7.094986, 50.732456), 4326)),
('Poppelsdorfer Allee 15', ST_SetSRID(ST_MakePoint(7.094293, 50.733784), 4326)),
('Kaiserplatz 16', ST_SetSRID(ST_MakePoint(7.100876, 50.733564), 4326)),
('Sandkaule 17', ST_SetSRID(ST_MakePoint(7.098235, 50.735263), 4326)),
('Quantiusstraße 18', ST_SetSRID(ST_MakePoint(7.097654, 50.730465), 4326)),
('Welschnonnenstraße 19', ST_SetSRID(ST_MakePoint(7.099087, 50.732345), 4326)),
('Koblenzer Straße 20', ST_SetSRID(ST_MakePoint(7.093218, 50.726112), 4326)),
('Viktoriabrücke 21', ST_SetSRID(ST_MakePoint(7.095384, 50.736982), 4326)),
('Endenicher Straße 22', ST_SetSRID(ST_MakePoint(7.091673, 50.735482), 4326)),
('Kennedyallee 23', ST_SetSRID(ST_MakePoint(7.114271, 50.725682), 4326)),
('Willy-Brandt-Allee 24', ST_SetSRID(ST_MakePoint(7.120873, 50.720167), 4326)),
('Augustusring 25', ST_SetSRID(ST_MakePoint(7.099645, 50.731485), 4326)),
('Bottlerplatz 26', ST_SetSRID(ST_MakePoint(7.097351, 50.735812), 4326)),
('Bonnstraße 27', ST_SetSRID(ST_MakePoint(7.110921, 50.724917), 4326)),
('Am Michaelshof 28', ST_SetSRID(ST_MakePoint(7.096112, 50.734217), 4326)),
('Brüdergasse 29', ST_SetSRID(ST_MakePoint(7.099217, 50.735054), 4326)),
('Kölnstraße 30', ST_SetSRID(ST_MakePoint(7.093254, 50.733561), 4326)),
('Dorotheenstraße 31', ST_SetSRID(ST_MakePoint(7.098542, 50.731982), 4326)),
('Bonngasse 32', ST_SetSRID(ST_MakePoint(7.099328, 50.735928), 4326)),
('Markt 33', ST_SetSRID(ST_MakePoint(7.099127, 50.735612), 4326)),
('Am Hofgarten 34', ST_SetSRID(ST_MakePoint(7.100231, 50.735192), 4326)),
('Sternstraße 35', ST_SetSRID(ST_MakePoint(7.098321, 50.736194), 4326)),
('Breite Straße 36', ST_SetSRID(ST_MakePoint(7.102321, 50.733821), 4326)),
('Am Botanischen Garten 37', ST_SetSRID(ST_MakePoint(7.095145, 50.733567), 4326)),
('Thomas-Mann-Straße 38', ST_SetSRID(ST_MakePoint(7.103251, 50.734961), 4326)),
('Noeggerathstraße 39', ST_SetSRID(ST_MakePoint(7.094283, 50.732546), 4326)),
('Langer Grabenweg 40', ST_SetSRID(ST_MakePoint(7.097671, 50.729345), 4326)),
('Moltkestraße 41', ST_SetSRID(ST_MakePoint(7.094365, 50.730756), 4326)),
('Prinz-Albert-Straße 42', ST_SetSRID(ST_MakePoint(7.099815, 50.731234), 4326)),
('Weberstraße 43', ST_SetSRID(ST_MakePoint(7.096128, 50.734213), 4326)),
('Im Krausfeld 44', ST_SetSRID(ST_MakePoint(7.095624, 50.735634), 4326)),
('Argelanderstraße 45', ST_SetSRID(ST_MakePoint(7.094762, 50.733258), 4326)),
('Sternenhof 46', ST_SetSRID(ST_MakePoint(7.099283, 50.736284), 4326)),
('Rathausgasse 47', ST_SetSRID(ST_MakePoint(7.098423, 50.735923), 4326)),
('Josefstraße 48', ST_SetSRID(ST_MakePoint(7.095761, 50.731562), 4326)),
('Am Hof 49', ST_SetSRID(ST_MakePoint(7.099812, 50.735873), 4326)),
('Brüderstraße 50', ST_SetSRID(ST_MakePoint(7.099124, 50.735341), 4326));


-- Select all data from vertices table 
SELECT * FROM vertices;