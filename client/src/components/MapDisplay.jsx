
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import './MapDisplay.css'; // Import the MapDisplay CSS

const MapDisplay = () => {
  const [locations, setLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/delivery');
        setLocations(response.data.locations || []); // Default to empty array if undefined
        setRoute(response.data.route || []); // Default to empty array if undefined
      } catch (err) {
        setError('Error fetching route data');
      }
    };
    fetchData();
  }, []);

  if (error) return <p>{error}</p>;

  // Check if locations and route are not empty
  if (!locations.length) return <p>Loading locations...</p>;
  if (!route.length) return <p>Loading route...</p>;

  return (
    <div className="map-container">
      <div className="map-box">
        <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {locations.map((location, index) => (
            <Marker key={index} position={location.coords}>
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
          <Polyline positions={route.map((loc) => loc.coords)} color="blue" />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapDisplay;
