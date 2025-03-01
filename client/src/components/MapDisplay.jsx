
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import axios from "axios";
import { SignedIn, useAuth } from "@clerk/clerk-react"; // Import Clerk components
import "./MapDisplay.css";
import BackToTop from "./BackToTop.jsx";

const { VITE_API_URL } = import.meta.env;

const MapDisplay = () => {
  const [locations, setLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [timeData, setTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([50.73743, 7.098206]);
  const { getToken } = useAuth(); // Get the getToken function from Clerk

  // Fetch delivery locations from the server
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = await getToken(); // Get the authentication token
        const response = await axios.get(`${VITE_API_URL}/api/delivery`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.deliveries)) {
          const fetchedLocations = response.data.deliveries.map((delivery) => ({
            address: delivery.address,
            lat: parseFloat(delivery.position_latitude),
            lng: parseFloat(delivery.position_longitude),
          }));

          // Filter out invalid coordinates
          const validLocations = fetchedLocations.filter(
            (loc) =>
              !isNaN(loc.lat) &&
              !isNaN(loc.lng) &&
              loc.lat !== 0 &&
              loc.lng !== 0
          );

          if (validLocations.length === 0) {
            throw new Error("No valid delivery locations available.");
          }

          // Deduplicate locations
          const uniqueLocations = Array.from(
            new Map(validLocations.map((loc) => [loc.address, loc])).values()
          );

          setLocations(uniqueLocations);
          setMapCenter(
            response.data.startCoordinates || [
              uniqueLocations[0].lat,
              uniqueLocations[0].lng,
            ]
          );
          setLoading(false);
        } else {
          throw new Error("Deliveries data is not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching delivery locations:", error);
        setError(`Failed to fetch delivery locations: ${error.message}`);
        setLoading(false);
      }
    };

    fetchLocations();
  }, [getToken]);

  // Fetch best route data from the backend
  useEffect(() => {
    const fetchRouteData = async () => {
      if (locations.length < 2) return;

      // Remove duplicates before sending
      const uniqueLocations = Array.from(
        new Map(locations.map((loc) => [loc.address, loc])).values()
      );

      try {
        const token = await getToken(); // Get the authentication token
        const response = await axios.post(
          `${VITE_API_URL}/api/best-route`,
          { locations: uniqueLocations },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.geometry?.coordinates) {
          const routeCoordinates = response.data.geometry.coordinates.map(
            (coord) => [coord[1], coord[0]] // Convert to Leaflet format [lat, lng]
          );

          setRoute(routeCoordinates);
          setTimeData(response.data);
        } else {
          throw new Error("Route data is invalid or incomplete.");
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
        setError(`Failed to fetch route data: ${error.message}`);
      }
    };

    fetchRouteData();
  }, [locations, getToken]);

  // Loading/Error States
  if (loading) return <h3 className="loading-message">Loading...</h3>;
  if (error) return <h3 className="loading-message">{error}</h3>;

  return (
    <SignedIn>
      <div className="map-display-container">
        <div className="map-display-box">
          <h2>Route Information</h2>
          <div className="summary-box">
            <div>
              <strong>Total Travel Time:</strong> {timeData?.duration || "N/A"}
            </div>
            <div>
              <strong>Total Distance:</strong> {timeData?.distance || "N/A"} meters
            </div>
          </div>

          <h2>Ordered Locations</h2>
          <ul className="locations-list">
            {timeData?.orderedLocations?.map((location, index) => (
              <li key={index}>
                <div>
                  <strong>{index + 1}.</strong> {location.address}
                </div>
                {index < timeData.orderedLocations.length - 1 && (
                  <>
                    <div>
                      <strong>Estimated Time:</strong>{" "}
                      {timeData.steps[index]?.duration || "-"}
                    </div>
                    <div>
                      <strong>
                        From {timeData.steps[index]?.from} to{" "}
                        {timeData.steps[index]?.to}:
                      </strong>{" "}
                      {timeData.steps[index]?.duration || "-"}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className="map-container">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              {/* Map Tiles */}
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Markers for Locations */}
              {locations.map((loc, index) => (
                <Marker key={index} position={[loc.lat, loc.lng]}>
                  <Popup>{`Location ${index + 1}: ${loc.address}`}</Popup>
                </Marker>
              ))}

              {/* Route as Polyline */}
              {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
            <BackToTop />
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default MapDisplay;

