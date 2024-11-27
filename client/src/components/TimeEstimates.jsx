// // import { useEffect, useState } from 'react';
// // import axios from 'axios';

// // const TimeEstimates = () => {
// //   const [timeData, setTimeData] = useState({});

// //   useEffect(() => {
// //     const fetchTimeData = async () => {
// //       try {
// //         const response = await axios.get('/api/route/times');
// //         setTimeData(response.data);
// //       } catch (error) {
// //         console.error('Error fetching time data:', error);
// //       }
// //     };
// //     fetchTimeData();
// //   }, []);

// //   return (
// //     <div className="time-estimates">
// //       <h3>Total Travel Time: {timeData.totalTime || 'Loading...'}</h3>
// //       <ul>
// //         {timeData.nodeTimes &&
// //           timeData.nodeTimes.map((time, index) => (
// //             <li key={index}>Node {index + 1} to Node {index + 2}: {time} minutes</li>
// //           ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default TimeEstimates;

// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const TimeEstimates = () => {
//   const [timeData, setTimeData] = useState({});

//   useEffect(() => {
//     const fetchTimeData = async () => {
//       try {
//         // Fetch the time estimates for the route
//         const response = await axios.get('/api/route/times');
//         setTimeData(response.data); // Store the time data in state
//       } catch (error) {
//         console.error('Error fetching time data:', error);
//       }
//     };
//     fetchTimeData(); // Trigger the data fetching when the component mounts
//   }, []);

//   return (
//     <div className="time-estimates">
//       <h3>Total Travel Time: {timeData.totalTime || 'Loading...'}</h3>
//       {/* Display the estimated time between nodes */}
//       <ul>
//         {timeData.nodeTimes &&
//           timeData.nodeTimes.map((time, index) => (
//             <li key={index}>
//               Node {index + 1} to Node {index + 2}: {time} minutes
//             </li>
//           ))}
//       </ul>
//     </div>
//   );
// };

// export default TimeEstimates;

//--27-11

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import "./TimeEstimates.css";

const TimeEstimates = () => {
  const [timeData, setTimeData] = useState({ nodeTimes: [] }); // Initialize with an empty array
  const [route, setRoute] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state

  // OpenRouteService API Key (using the key you provided)
  const ORS_API_KEY =
    "5b3ce3597851110001cf624864d8f86a8172480696f9789e80e67237"; // Provided OpenRouteService API key
  const ORS_API_URL =
    "https://api.openrouteservice.org/v2/directions/driving-car";

  // Fetch time data from your API or calculate using OpenRouteService
  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        // Example call to your API endpoint `/api/route/times` to fetch nodes and times

        // ❗️❗️❗️ There is no route "api/times" in your server.js or in other routes. What should be received here?
        // If you want to receive here the list of deliveries, points where delivery guy should go to deliver the parcel, then
        // you need an appropriate route and controller in server.
        // You have getDeliveries controller in server/Controller/getDelivery.js. You probably can use it, but pay attention to my note there.
        // There is also app.get("/api/delivery") in server.js which seems to be doing the same thing, so choose one of this methods
        // and delete the not needed one. If you want to use the one from getDelivery.js then include it in server.js with
        // "app.use("/api/deliveries", deliveriesRoute)" and don't forget to import it.
        // After that you will be able to use your route in the request below as "const response = await axios.get("http://localhost:3000/api/deliveries");""

        const response = await axios.get("http://localhost:3000/api/times");
        console.log("response", response);
        setTimeData(response.data);
        setNodes(response.data.nodes); // Assuming nodes is an array of coordinates
        fetchRoute(response.data.nodes); // Fetch route between nodes
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching time data:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };
    fetchTimeData();
  }, []);

  // ❗️❗️❗️ It won't work until you fix the issue above with "api/times" route
  const fetchRoute = async (nodes) => {
    if (nodes.length >= 2) {
      try {
        // Extract coordinates from nodes (assuming each node contains latitude and longitude)
        const coordinates = nodes.map((node) => [
          node.latitude,
          node.longitude,
        ]);

        const params = {
          coordinates: coordinates,
          format: "geojson",
        };

        // Request route data from OpenRouteService API
        const response = await axios.post(ORS_API_URL, params, {
          headers: {
            Authorization: ORS_API_KEY, // Use the API key in the header
          },
        });

        const routeData = response.data.routes[0];
        setRoute(routeData.geometry.coordinates);
      } catch (error) {
        console.error("Error fetching the route:", error);
      }
    }
  };

  return (
    <div className="time-estimates">
      {/* Loading State */}
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <h3>Total Travel Time: {timeData.totalTime || "N/A"}</h3>
          <ul>
            {timeData.nodeTimes && timeData.nodeTimes.length > 0 ? (
              timeData.nodeTimes.map((time, index) => (
                <li key={index}>
                  Node {index + 1} to Node {index + 2}: {time} minutes
                </li>
              ))
            ) : (
              <li>No time data available</li>
            )}
          </ul>
        </>
      )}
      {/* 
      <MapContainer
        center={[50.73743, 7.098206]} // Default coordinates (can be adjusted)
        zoom={13}
        style={{ width: "100%", height: "400px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {nodes.map((node, index) => (
          <Marker
            key={index}
            position={[node.latitude, node.longitude]}
            icon={L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          />
        ))}

        {route.length > 0 && (
          <Polyline positions={route} color="blue" weight={4} />
        )}
      </MapContainer> */}

      <div id="map">
        <MapContainer center={[51.505, -0.09]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default TimeEstimates;
