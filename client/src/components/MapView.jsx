import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapView = () => {
  const [locations, setLocations] = useState([]);
  const [bestRoute, setBestRoute] = useState([]);

  useEffect(() => {
    // Fetch the best route and locations from the backend
    axios.get('/MapView.js')
      .then(response => {
        const { route, estimatedTime } = response.data;
        console.log(`Estimated time: ${estimatedTime} minutes`);
        setBestRoute(route.map(coord => ({ coords: [coord[1], coord[0]] })));
      })
      .catch(error => {
        console.error('Error fetching best route:', error);
      });

    axios.get('/MapView.js')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
  }, []);

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
      {bestRoute.length > 0 && (
        <Polyline
          positions={bestRoute.map(location => location.coords)}
          color="blue"
        />
      )}
    </MapContainer>
  );
};

export default MapView;
