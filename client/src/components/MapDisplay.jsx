
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import './MapDisplay.css'; // Import the MapDisplay CSS

const MapDisplay = () => {
  const [locations, setLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [timeData, setTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch delivery locations from the server
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/delivery");
        const fetchedLocations = response.data.map((delivery) => ({
          address: delivery.address,
          lat: delivery.position_latitude,
          lng: delivery.position_longitude,
        }));

        const validLocations = fetchedLocations.filter(
          (loc) => loc.lat && loc.lng
        );

        if (validLocations.length === 0) {
          throw new Error("No valid locations found.");
        }

        setLocations(validLocations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery locations:", error);
        setError(`Failed to fetch delivery locations: ${error.message}`);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Fetch best route data from the backend
  useEffect(() => {
    const fetchRouteData = async () => {
      if (locations.length < 2) return;
      try {
        const response = await axios.post(
          "http://localhost:3000/api/best-route",
          { locations }
        );

        if (response.data && response.data.geometry && response.data.geometry.coordinates) {
          setTimeData(response.data);
          setRoute(
            response.data.geometry.coordinates.map((coord) => [
              coord[1],
              coord[0],
            ])
          );
        } else {
          throw new Error("Route data is invalid or incomplete.");
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
        setError(`Failed to fetch route data: ${error.message}`);
      }
    };

    if (locations.length >= 2) {
      fetchRouteData();
    }
  }, [locations]);

  if (loading) return <h3 className="loading-message">Loading...</h3>;
  if (error) return <h3 className="loading-message">{error}</h3>;

  return (
    <div className="map-display-container">
      <div className="map-display-box">
        <h3>Route Information</h3>
        <div className="summary-box">
          <div><strong>Total Travel Time:</strong> {timeData?.duration}</div>
          <div><strong>Total Distance:</strong> {timeData?.distance} km</div>
        </div>

        <h3>Ordered Locations</h3>
        <ul className="locations-list">
          {timeData?.orderedLocations?.map((location, index) => (
            <li key={index}>
              <div><strong>{index + 1}.</strong> {location.address}</div>
              {index < timeData.orderedLocations.length - 1 && (
                <div><strong>Estimated Time:</strong> {location.estimatedTime || "-"}</div>
              )}
              {index < timeData.orderedLocations.length - 1 && (
                <div><strong>From {location.address} to {timeData.orderedLocations[index + 1].address}:</strong> {location.estimatedTime || "-"}</div>
              )}
            </li>
          ))}
        </ul>

        <div className="map-container">
          <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((loc, index) => (
              <Marker key={index} position={[loc.lat, loc.lng]}>
                <Popup>{`Location ${index + 1}: ${loc.address}`}</Popup>
              </Marker>
            ))}
            <Polyline positions={route} color="blue" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
