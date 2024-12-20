
DROP TABLE IF EXISTS locations CASCADE;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL
);

-- Insert the data
INSERT INTO locations (address, latitude, longitude) VALUES
('Adenauerallee 1', 50.73743, 7.098206),
('Belderberg 2', 50.735887, 7.101445),
('Breite Straße 3', 50.733134, 7.101786),
('Clemens-August-Straße 4', 50.731244, 7.103915),
('Heerstraße 5', 50.733892, 7.103623),
('Römerstraße 6', 50.732895, 7.099423),
('Maxstraße 7', 50.734671, 7.097592),
('Beethovenplatz 8', 50.735982, 7.101354),
('Friedrichstraße 9', 50.734545, 7.098921),
('Kaiserstraße 10', 50.732756, 7.100991),
('Münsterstraße 11', 50.734206, 7.097312),
('Am Hofgarten 12', 50.735573, 7.100321),
('Beringstraße 13', 50.736845, 7.102015),
('Baumschulallee 14', 50.732456, 7.094986),
('Poppelsdorfer Allee 15', 50.733784, 7.094293),
('Kaiserplatz 16', 50.733564, 7.100876),
('Sandkaule 17', 50.735263, 7.098235),
('Quantiusstraße 18', 50.730465, 7.097654),
('Welschnonnenstraße 19', 50.732345, 7.099087),
('Koblenzer Straße 20', 50.726112, 7.093218),
('Viktoriabrücke 21', 50.736982, 7.095384),
('Endenicher Straße 22', 50.735482, 7.091673),
('Kennedyallee 23', 50.725682, 7.114271),
('Willy-Brandt-Allee 24', 50.720167, 7.120873),
('Augustusring 25', 50.731485, 7.099645),
('Bottlerplatz 26', 50.735812, 7.097351),
('Bonnstraße 27', 50.724917, 7.110921),
('Am Michaelshof 28', 50.734217, 7.096112),
('Brüdergasse 29', 50.735054, 7.099217),
('Kölnstraße 30', 50.733561, 7.093254),
('Dorotheenstraße 31', 50.731982, 7.098542),
('Bonngasse 32', 50.735928, 7.099328),
('Markt 33', 50.735612, 7.099127),
('Am Hofgarten 34', 50.735192, 7.100231),
('Sternstraße 35', 50.736194, 7.098321),
('Breite Straße 36', 50.733821, 7.102321),
('Am Botanischen Garten 37', 50.733567, 7.095145),
('Thomas-Mann-Straße 38', 50.734961, 7.103251),
('Noeggerathstraße 39', 50.732546, 7.094283),
('Langer Grabenweg 40', 50.729345, 7.097671),
('Moltkestraße 41', 50.730756, 7.094365),
('Prinz-Albert-Straße 42', 50.731234, 7.099815),
('Weberstraße 43', 50.734213, 7.096128),
('Im Krausfeld 44', 50.735634, 7.095624),
('Argelanderstraße 45', 50.733258, 7.094762),
('Sternenhof 46', 50.736284, 7.099283),
('Rathausgasse 47', 50.735923, 7.098423),
('Josefstraße 48', 50.731562, 7.095761),
('Am Hof 49', 50.735873, 7.099812),
('Brüderstraße 50', 50.735341, 7.099124),
('Kurfürstendamm 2', 52.507798, 13.331307),
('Olympiastadion 30', 52.514568, 13.239502),
('Schloss Bellevue 4', 52.514344, 13.352838),
('Charlottenburg 34', 52.520273, 13.351339),
('Unter den Linden 9', 52.514678, 13.381777),
('Siegessäule 6', 52.514404, 13.350419),
('Tempelhofer Feld 4', 52.474604, 13.403732),
('Bebelplatz 5', 52.517273, 13.394619),
('Berlin Hauptbahnhof 2', 52.525687, 13.369474),
('Berlin Zoo 6', 52.508404, 13.337835);



-- Select all data from locations table
--SELECT * FROM locations;
SELECT latitude, longitude FROM locations;