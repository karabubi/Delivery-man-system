
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "./TimeEstimates.css";

const TimeEstimates = () => {
  const [timeData, setTimeData] = useState(null);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/delivery");
        const fetchedLocations = response.data.map((delivery) => ({
          address: delivery.address,
          lat: delivery.position_latitude,
          lng: delivery.position_longitude,
        }));
        setLocations(fetchedLocations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery locations:", error);
        setError(`Failed to fetch delivery locations: ${error.message}`);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchRouteData = async () => {
      if (locations.length < 2) return;
      try {
        const response = await axios.post("http://localhost:3000/api/best-route", { locations });

        if (response.data && response.data.geometry && response.data.geometry.coordinates) {
          setTimeData(response.data);
          setRoute(response.data.geometry.coordinates.map(coord => [coord[1], coord[0]]));
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
    <div className="time-estimates">
      <div className="time-estimates-box">
        <h3>Route Information</h3>
        <div className="summary-box">
          <div>
            <strong>Total Travel Time:</strong> {timeData?.duration}
          </div>
          <div>
            <strong>Total Distance:</strong> {timeData?.distance} km
          </div>
        </div>

        <h3>Ordered Locations</h3>
        <ul className="locations-list">
          {timeData?.orderedLocations?.map((location, index) => (
            <li key={index}>
              <div>
                <strong>{index + 1}.</strong> {location.address}
              </div>
              {index < timeData.orderedLocations.length - 1 && (
                <div>
                  <strong>Estimated Time:</strong> {location.estimatedTime ? location.estimatedTime : "-"}
                </div>
              )}
              {index < timeData.orderedLocations.length - 1 && (
                <div>
                  <strong>From {location.address} to {timeData.orderedLocations[index + 1].address}:</strong>
                  <span> {location.estimatedTime ? location.estimatedTime : "-"} </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="map-container-box">
        <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: "100%", width: "800px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lng]}>
              <Popup>{`Location ${index + 1}`}</Popup>
            </Marker>
          ))}
          <Polyline positions={route} color="blue" />
        </MapContainer>
      </div>
    </div>
  );
};

export default TimeEstimates;
