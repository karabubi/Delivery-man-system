
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "./BigMapView.css"; 
const BigMapView = () => {
 const [locations, setLocations] = useState([]);
 const [route, setRoute] = useState([]);
 const [timeData, setTimeData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);


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
         throw new Error("Invalid route data.");
       }
     } catch (error) {
       setError(`Failed to fetch route data: ${error.message}`);
     }
   };


   if (locations.length >= 2) {
     fetchRouteData();
   }
 }, [locations]);


 if (loading) return <h3>Loading...</h3>;
 if (error) return <h3>{error}</h3>;


 return (
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
           <Marker key={index} position={[loc.lat, loc.lng]}>
             <Popup>{`Location ${index + 1}: ${loc.address}`}</Popup>
           </Marker>
         ))}
         <Polyline positions={route} color="blue" />
       </MapContainer>
     </div>


     {timeData && (
       <div className="route-summary-big">
         <h3>Route Summary</h3>
         <p><strong>Total Travel Time:</strong> {timeData.duration}</p>
         <p><strong>Total Distance:</strong> {timeData.distance} km</p>
       </div>
     )}
   </div>
 );
};


export default BigMapView;
