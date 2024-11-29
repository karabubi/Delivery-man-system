
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "./TimeEstimates.css";

const TimeEstimates = () => {
  const [timeData, setTimeData] = useState(null);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const locations = [
    { lat: 50.73743, lng: 7.098206 },
    { lat: 50.731244, lng: 7.103915 },
    { lat: 50.733892, lng: 7.103623 },
    { lat: 50.726112, lng: 7.093218 },
    { lat: 50.736982, lng: 7.095384 },
    { lat: 50.735482, lng: 7.091673 },
    { lat: 50.735612, lng: 7.099127 },
  ];

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/best-route", { locations });

        console.log("Response Data:", JSON.stringify(response.data, null, 2));

        if (response.data && response.data.geometry && response.data.geometry.coordinates) {
          setTimeData(response.data);
          setRoute(response.data.geometry.coordinates.map(coord => [coord[1], coord[0]]));
        } else {
          throw new Error("Route data is invalid or incomplete.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching route data:", error);
        setError(`Failed to fetch route data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchRouteData();
  }, []);

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>{error}</h3>;

  return (
    <div className="time-estimates">
      <h3>Total Travel Time: {timeData?.duration} minutes</h3>
      <h3>Total Distance: {timeData?.distance} km</h3>
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



//     import { useEffect, useState } from "react";
// import axios from "axios";
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
// import "./TimeEstimates.css";

// const TimeEstimates = () => {
//   const [timeData, setTimeData] = useState(null); // Stores time data (duration, distance)
//   const [route, setRoute] = useState([]); // Stores route geometry data for the map
//   const [loading, setLoading] = useState(true); // To track loading state

//   // List of locations (coordinates) for the route calculation
//   const locations = [
//     { lat: 50.73743, lng: 7.098206 }, // Adenauerallee 1
//     { lat: 50.731244, lng: 7.103915 }, // Clemens-August-Straße 4
//     { lat: 50.733892, lng: 7.103623 }, // Heerstraße 5
//     { lat: 50.726112, lng: 7.093218 }, // Koblenzer Straße 20
//     { lat: 50.736982, lng: 7.095384 }, // Viktoriabrücke 21
//     { lat: 50.735482, lng: 7.091673 }, // Endenicher Straße 22
//     { lat: 50.735612, lng: 7.099127 }, // Markt 33
//   ];

//   // Fetch route data from the backend when the component mounts
//   useEffect(() => {
//     const fetchRouteData = async () => {
//       try {
//         // Send POST request to fetch route data
//         const response = await axios.post("http://localhost:3000/api/best-route", { locations });
//         setTimeData(response.data); // Set time data (estimated time and distance)
//         setRoute(response.data.geometry.coordinates); // Set the route geometry for the map
//         setLoading(false); // Stop loading
//       } catch (error) {
//         console.error("Error fetching route data:", error);
//         setLoading(false); // Stop loading in case of error
//       }
//     };

//     fetchRouteData(); // Call the function to fetch the route data
//   }, [locations]); // Dependency array to ensure this runs when locations change

//   // Ensure route data is available before rendering the map and Polyline
//   if (loading) return <h3>Loading...</h3>;

//   if (!route || route.length === 0) {
//     return <h3>No route data available.</h3>;
//   }

//   return (
//     <div className="time-estimates">
//       <h3>Total Travel Time: {timeData?.duration} minutes</h3> {/* Display total estimated time */}
//       <h3>Total Distance: {timeData?.distance} km</h3> {/* Display total route distance */}
//       <ul>
//         {/* Iterate over the legs and display each leg's information */}
//         {timeData?.legs?.map((leg, index) => (
//           <li key={index}>
//             Leg {leg.legNumber}: {leg.summary}, {leg.distance / 1000} km, {leg.duration / 60} minutes
//           </li>
//         ))}
//       </ul>

//       {/* Map container to display the route */}
//       <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: "400px", width: "100%" }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         {/* Place markers at the locations */}
//         {locations.map((loc, index) => (
//           <Marker key={index} position={[loc.lat, loc.lng]}>
//             <Popup>{`Location ${index + 1}`}</Popup>
//           </Marker>
//         ))}
//         {/* Ensure route is defined and pass it to Polyline */}
//         {route && route.length > 0 && <Polyline positions={route} color="blue" />}
//       </MapContainer>
//     </div>
//   );
// };

// export default TimeEstimates;
