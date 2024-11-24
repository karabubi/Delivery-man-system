// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import NavBar from "./NavBar.jsx"; // Import NavBar component
// import './Home.css';
// const Home = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
//   const navigate = useNavigate();

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Clear token from storage
//     setIsAuthenticated(false); // Update authentication state
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <div>
//       {/* Pass state and logout handler to NavBar */}
//       <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

//       {/* Main content */}
//       <main style={{ padding: "2rem", textAlign: "center" }}>
//         <h2>Welcome to the Delivery System</h2>
//         <p>
//           Manage your delivery routes efficiently. Please register or login to
//           access your dashboard.
//         </p>
//       </main>
//     </div>
//   );
// };

// export default Home;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'; // Import the Home CSS for styling
import NavBar from "./NavBar.jsx"; // Import NavBar component
const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // User authentication state
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from storage
    setIsAuthenticated(false); // Reset authentication state
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="home-container">
      {/* Include the navigation bar */}
      <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

      {/* Header Section with Background */}
      <header className="home-header">
        <div className="header-content">
          <h1>Welcome to the Delivery System</h1>
        </div>
      </header>

    </div>
  );
};

export default Home;

