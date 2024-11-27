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




import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

const TimeEstimates = () => {
  const [timeData, setTimeData] = useState({ nodeTimes: [] });  // Initialize with an empty array
  const [route, setRoute] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  
  // OpenRouteService API Key (using the key you provided)
  const ORS_API_KEY = '5b3ce3597851110001cf624864d8f86a8172480696f9789e80e67237';  // Provided OpenRouteService API key
  const ORS_API_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

  // Fetch time data from your API or calculate using OpenRouteService
  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        // Example call to your API endpoint `/api/route/times` to fetch nodes and times
        const response = await axios.get('http://localhost:3000/api/times');
        setTimeData(response.data);
        setNodes(response.data.nodes);  // Assuming nodes is an array of coordinates
        fetchRoute(response.data.nodes);  // Fetch route between nodes
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching time data:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };
    fetchTimeData();
  }, []);

  // Fetch route data using OpenRouteService API
  const fetchRoute = async (nodes) => {
    if (nodes.length >= 2) {
      try {
        // Extract coordinates from nodes (assuming each node contains latitude and longitude)
        const coordinates = nodes.map(node => [node.latitude, node.longitude]);
        
        const params = {
          coordinates: coordinates,
          format: 'geojson',
        };

        // Request route data from OpenRouteService API
        const response = await axios.post(ORS_API_URL, params, {
          headers: {
            'Authorization': ORS_API_KEY,  // Use the API key in the header
          },
        });

        const routeData = response.data.routes[0];
        setRoute(routeData.geometry.coordinates);
      } catch (error) {
        console.error('Error fetching the route:', error);
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
          <h3>Total Travel Time: {timeData.totalTime || 'N/A'}</h3>
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

      <MapContainer
        center={[50.73743, 7.098206]}  // Default coordinates (can be adjusted)
        zoom={13}
        style={{ width: '100%', height: '400px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {nodes.map((node, index) => (
          <Marker
            key={index}
            position={[node.latitude, node.longitude]}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          />
        ))}
        
        {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
      </MapContainer>
    </div>
  );
};

export default TimeEstimates;






// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
// import L from 'leaflet';
// import './TimeEstimates.css'; // Import the TimeEstimates CSS

// const TimeEstimates = () => {
//   const [timeData, setTimeData] = useState({ nodeTimes: [] });
//   const [route, setRoute] = useState([]);
//   const [nodes, setNodes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const ORS_API_KEY = '5b3ce3597851110001cf624864d8f86a8172480696f9789e80e67237';
//   const ORS_API_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

//   useEffect(() => {
//     const fetchTimeData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/times');
//         setTimeData(response.data);
//         setNodes(response.data.nodes);
//         fetchRoute(response.data.nodes);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching time data:', error);
//         setLoading(false);
//       }
//     };

//     fetchTimeData();
//   }, []);

//   const fetchRoute = async (nodes) => {
//     if (nodes.length >= 2) {
//       try {
//         const coordinates = nodes.map(node => [node.latitude, node.longitude]);
//         const params = {
//           coordinates: coordinates,
//           format: 'geojson',
//         };

//         const response = await axios.post(ORS_API_URL, params, {
//           headers: {
//             'Authorization': ORS_API_KEY,
//           },
//         });

//         const routeData = response.data.routes[0];
//         setRoute(routeData.geometry.coordinates);
//       } catch (error) {
//         console.error('Error fetching the route:', error);
//       }
//     }
//   };

//   return (
//     <div className="time-estimates">
//       <div className="time-estimates-box">
//         {loading ? (
//           <h3 className="loading-message">Loading...</h3>
//         ) : (
//           <>
//             <h3>Total Travel Time: {timeData.totalTime || 'N/A'}</h3>
//             <ul>
//               {timeData.nodeTimes && timeData.nodeTimes.length > 0 ? (
//                 timeData.nodeTimes.map((time, index) => (
//                   <li key={index}>
//                     Node {index + 1} to Node {index + 2}: {time} minutes
//                   </li>
//                 ))
//               ) : (
//                 <li>No time data available</li>
//               )}
//             </ul>
//           </>
//         )}

//         <div className="map-container-box">
//           <MapContainer
//             center={[50.73743, 7.098206]}
//             zoom={13}
//             style={{ width: '100%', height: '100%' }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//             {nodes.map((node, index) => (
//               <Marker
//                 key={index}
//                 position={[node.latitude, node.longitude]}
//                 icon={L.icon({
//                   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//                   iconSize: [25, 41],
//                   iconAnchor: [12, 41],
//                 })}
//               />
//             ))}

//             {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
//           </MapContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TimeEstimates;
