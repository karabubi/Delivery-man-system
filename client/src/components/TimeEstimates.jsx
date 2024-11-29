
    import { useEffect, useState } from "react";
    import axios from "axios";
    import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
    import L from "leaflet";
    import "./TimeEstimates.css";
   
    const TimeEstimates = () => {
      const [timeData, setTimeData] = useState(null);
      const [route, setRoute] = useState([]);
      const [loading, setLoading] = useState(true);
   
      // Example list of nodes (locations) to calculate the route
      const locations = [
        { lat: 50.73743, lng: 7.098206 }, // Adenauerallee 1
        { lat: 50.731244, lng: 7.103915 }, // Clemens-August-Straße 4
        { lat: 50.733892, lng: 7.103623 }, // Heerstraße 5
        { lat: 50.726112, lng: 7.093218 }, // Koblenzer Straße 20
        { lat: 50.736982, lng: 7.095384 }, // Viktoriabrücke 21
        { lat: 50.735482, lng: 7.091673 }, // Endenicher Straße 22
        { lat: 50.735612, lng: 7.099127 }  // Markt 33
      ];
      
      useEffect(() => {
        const fetchRouteData = async () => {
          try {
            // Fetch route data from the server's new route API
            const response = await axios.post("http://localhost:3000/api/get-route", { locations });
            setTimeData(response.data); // Set the fetched route data
            setRoute(response.data.route); // Set the polyline for the route
            setLoading(false); // Set loading state to false
          } catch (error) {
            console.error("Error fetching route data:", error);
            setLoading(false);
          }
        };
   
        fetchRouteData();
      }, []);
   
      return (
        <div className="time-estimates">
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <>
              <h3>Total Travel Time: {timeData?.duration} minutes</h3>
              <h3>Total Distance: {timeData?.distance} km</h3>
              <ul>
                {timeData?.legs?.map((leg, index) => (
                  <li key={index}>
                    Leg {leg.legNumber}: {leg.summary}, {leg.distance / 1000} km, {leg.duration / 60} minutes
                  </li>
                ))}
              </ul>
            </>
          )}
   
          <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((loc, index) => (
              <Marker key={index} position={[loc.lat, loc.lng]}>
                <Popup>{`Location ${index + 1}`}</Popup>
              </Marker>
            ))}
            <Polyline positions={route} color="blue" />
          </MapContainer>
        </div>
      );
    };
   
    export default TimeEstimates;
 