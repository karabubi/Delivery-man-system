import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const MapDisplay = () => {
  const [locations, setLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const[error,setError]=useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/route');
        setLocations(response.data.locations);
        setRoute(response.data.route);
      } catch (err) {
        setError('Error fetching route data');
      }
    };
    fetchData();
  }, []);
  if (error) return <p>{error}</p>;
  if (!locations.length) return <p>Loading...</p>;
 
  return (
    <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: '500px', width: '100%' }}>
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
  );
};

export default MapDisplay;
