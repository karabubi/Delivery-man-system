





import './Home.css';
import BackToTop from '../components/BackToTop';
const Home = () => {
 return (
   <div className="home-container">
     {/* Header Section */}
     <header className="home-header-home">
       <div className="header-content">
         <h1>Welcome to the Delivery System</h1>
       </div>
     </header>


     {/* Main Content Section */}
     <div className="home-main">
       <h2>How to Use the Delivery System</h2>
       <p>
         The Delivery System helps you organize your deliveries and optimize your routes, saving time and cost. Here's
         how you can use it:
       </p>


       <div className="info-section-R">
         <strong>RouteDashboard:</strong>
         <p><strong>Purpose:</strong></p>
         <ul>
           <li>Displays detailed route information and ordered delivery locations on a map.</li>
         </ul>
         <p><strong>Features:</strong></p>
         <ul>
           <li>Fetches delivery locations and renders them as markers on a map.</li>
           <li>Displays the optimized route with polyline navigation.</li>
           <li>Shows a list of ordered delivery locations with estimated travel times.</li>
         </ul>
       </div>


       <div className="info-section-A">
         <strong>AddressList:</strong>
         <p><strong>Purpose:</strong></p>
         <ul>
           <li>Displays a list of delivery addresses fetched from the backend.</li>
         </ul>
         <p><strong>Features:</strong></p>
         <ul>
           <li>Fetches delivery data (address, latitude, longitude) via API using the user's token stored in
             localStorage.
           </li>
           <li>Renders a list of addresses with their geographical coordinates.</li>
         </ul>
       </div>


       <div className="info-section-D">
         <strong>DeliveryManagement:</strong>
         <p><strong>Purpose:</strong></p>
         <ul>
           <li>Enables users to manage delivery addresses, including uploading, editing, and deleting them.</li>
         </ul>
         <p><strong>Features:</strong></p>
         <ul>
           <li>Fetches delivery addresses and allows bulk management.</li>
           <li>Allows CSV uploads for batch address additions.</li>
           <li>Supports individual and bulk deletion of addresses.</li>
         </ul>
       </div>


       <div className="info-section-B">
         <strong>BigMapView:</strong>
         <p><strong>Purpose:</strong></p>
         <ul>
           <li>Provides a big map view of delivery locations and the optimized route.</li>
         </ul>
         <p><strong>Features:</strong></p>
         <ul>
           <li>Displays delivery locations on an interactive map.</li>
           <li>Highlights the optimized delivery route using a polyline.</li>
           <li>Fetches delivery data and route optimization details (e.g., distance, duration).</li>
           <li>Shows a summary of the total travel time and distance.</li>
         </ul>
       </div>


       <p>
         Start by exploring the Dashboard to get an overview of your routes or manage your delivery addresses directly.
       </p>
      
     </div>
     <BackToTop />
   </div>
 );
};


export default Home;
