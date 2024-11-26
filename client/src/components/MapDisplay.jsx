// import { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
// import axios from 'axios';

// const MapDisplay = () => {
//   const [locations, setLocations] = useState([]);
//   const [route, setRoute] = useState([]);
//   const[error,setError]=useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/route');
//         setLocations(response.data.locations);
//         setRoute(response.data.route);
//       } catch (err) {
//         setError('Error fetching route data');
//       }
//     };
//     fetchData();
//   }, []);
//   if (error) return <p>{error}</p>;
//   if (!locations.length) return <p>Loading...</p>;
 
//   return (
//     <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: '500px', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; OpenStreetMap contributors"
//       />
//       {locations.map((location, index) => (
//         <Marker key={index} position={location.coords}>
//           <Popup>{location.name}</Popup>
//         </Marker>
//       ))}
//       <Polyline positions={route.map((loc) => loc.coords)} color="blue" />
//     </MapContainer>
//   );
// };

// export default MapDisplay;



//----26-11-14

// import { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'; // Import necessary components from react-leaflet
// import axios from 'axios';
// import L from 'leaflet'; // Import Leaflet for creating custom marker icons

// const MapDisplay = () => {
//   const [locations, setLocations] = useState([]);
//   const [route, setRoute] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/route');
//         setLocations(response.data.locations || []); // Ensure locations is an empty array if not available
//         setRoute(response.data.route || []); // Ensure route is an empty array if not available
//       } catch (err) {
//         setError('Error fetching route data');
//       }
//     };
//     fetchData(); // Fetch route data when the component mounts
//   }, []);

//   if (error) return <p>{error}</p>; // Display error message if fetch fails
//   if (!locations || !locations.length || !route || !route.length) return <p>Loading...</p>; // Show loading message if data is not yet available

//   // Define a custom marker icon (using a red dot as an example)
//   const markerIcon = new L.Icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Red_dot.svg', // Replace with your custom image URL
//     iconSize: [30, 30], // Set the size of the icon (width, height)
//     iconAnchor: [15, 30], // Set the point of the icon that will be anchored to the marker position
//     popupAnchor: [0, -30], // Position of the popup relative to the icon
//   });

//   return (
//     <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: '500px', width: '100%' }}>
//       {/* OpenStreetMap TileLayer */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL for OpenStreetMap tiles
//         attribution="&copy; OpenStreetMap contributors"
//       />
//       {/* Render markers for each location */}
//       {locations.map((location, index) => (
//         <Marker key={index} position={location.coords} icon={markerIcon}>
//           <Popup>{location.name}</Popup>
//         </Marker>
//       ))}
//       {/* Render the polyline (route) on the map */}
//       {route && route.length > 0 && (
//         <Polyline positions={route.map((loc) => loc.coords)} color="blue" />
//       )}
//     </MapContainer>
//   );
// };

// export default MapDisplay;
  //-----2 





// import { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
// import axios from 'axios';

// const MapDisplay = () => {
//   const [locations, setLocations] = useState([]);
//   const [route, setRoute] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/route');
//         setLocations(response.data.locations); // Locations array
//         setRoute(response.data.route);         // Route array
//       } catch (err) {
//         setError('Error fetching route data');
//       }
//     };
//     fetchData();
//   }, []);

//   if (error) return <p>{error}</p>;
//   if (!locations.length) return <p>Loading...</p>;

//   return (
//     <MapContainer center={[50.73743, 7.098206]} zoom={13} style={{ height: '500px', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; OpenStreetMap contributors"
//       />
//       {locations.map((location, index) => (
//         <Marker key={index} position={location.coords}>
//           <Popup>{location.name}</Popup>
//         </Marker>
//       ))}
//       <Polyline positions={route.map((loc) => loc.coords)} color="blue" />
//     </MapContainer>
//   );
// };

// export default MapDisplay;




import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const MapDisplay = () => {
  const [locations, setLocations] = useState([]); // Initialized as an empty array
  const [route, setRoute] = useState([]); // Initialized as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/route');
        setLocations(response.data.locations || []); // Safe fallback to an empty array
        setRoute(response.data.route || []); // Safe fallback to an empty array
      } catch (err) {
        setError('Error fetching route data');
      }
    };
    fetchData();
  }, []);

  // Show error or loading state if data is not available
  if (error) return <p>{error}</p>;
  if (!locations.length || !route.length) return <p>Loading...</p>; // Ensure both are loaded

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
