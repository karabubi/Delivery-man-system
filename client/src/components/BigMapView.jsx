

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import { SignedIn, useAuth } from "@clerk/clerk-react"; // Import Clerk components
import "./BigMapView.css";
import BackToTop from "./BackToTop";

const { VITE_API_URL } = import.meta.env;

const BigMapView = () => {
  const [locations, setLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [timeData, setTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth(); // Get the getToken function from Clerk

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = await getToken(); // Get the authentication token
        const response = await axios.get(`${VITE_API_URL}/api/delivery`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Log the response for debugging

        // Assuming the API response contains an array under the 'deliveries' key
        const fetchedLocations = Array.isArray(response.data.deliveries)
          ? response.data.deliveries.map((delivery) => ({
              address: delivery.address,
              lat: delivery.position_latitude,
              lng: delivery.position_longitude,
            }))
          : [];

        // Filter out locations with invalid latitudes or longitudes
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
  }, [getToken]);

  useEffect(() => {
    const fetchRouteData = async () => {
      if (locations.length < 2) return;

      try {
        const token = await getToken(); // Get the authentication token
        const response = await axios.post(
          `${VITE_API_URL}/api/best-route`,
          { locations },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (
          response.data &&
          response.data.geometry &&
          response.data.geometry.coordinates
        ) {
          setTimeData(response.data);
          setRoute(
            response.data.geometry.coordinates.map((coord) => [
              coord[1],
              coord[0],
            ])
          );
        } else {
          throw new Error("Invalid route data.");
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
        setError(`Failed to fetch route data: ${error.message}`);
      }
    };

    if (locations.length >= 2) {
      fetchRouteData();
    }
  }, [locations, getToken]);

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>{error}</h3>;

  return (
    <SignedIn>
      <div className="big-map-view">
        <h1>Delivery Route and Map</h1>
        <div className="map-container-box-big">
          <MapContainer
            center={[50.73743, 7.098206]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((loc, index) => (
              <Marker key={loc.address} position={[loc.lat, loc.lng]}>
                <Popup>{`Location ${index + 1}: ${loc.address}`}</Popup>
              </Marker>
            ))}
            {route.length > 0 && <Polyline positions={route} color="blue" />}
          </MapContainer>
        </div>

        {timeData && (
          <div className="route-summary-big">
            <h4>Route Summary</h4>
            <p>
              <strong>Total Travel Time:</strong> {timeData.duration}
            </p>
            <p>
              <strong>Total Distance:</strong> {timeData.distance} km
            </p>
            <BackToTop />
          </div>
        )}
      </div>
    </SignedIn>
  );
};

export default BigMapView;