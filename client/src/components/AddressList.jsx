import { useEffect, useState } from "react";
import axios from "axios";
import "./AddressList.css";
const AddressList = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/addresses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddresses(response.data.addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <div className="address-list-container">
      <h2>My Addresses</h2>
      <ul>
        {/* Using .map() to iterate over the addresses */}
        {addresses.map((address, index) => (
          <li key={index}>
            {" "}
            {/* Each list item needs a unique key */}
            <div>
              <strong>Address:</strong> {address.address} <br />
              <span>
                <strong>Latitude:</strong> {address.latitude} <br />
              </span>
              <span>
                <strong>Longitude:</strong> {address.longitude} <br />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressList;













//--------27-11-24-20:25


// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./AddressList.css";

// const AddressList = () => {
//   const [addresses, setAddresses] = useState([]);
//   const [error, setError] = useState(""); // For error handling
//   const [loading, setLoading] = useState(true); // For loading state

//   useEffect(() => {
//     // Fetch the addresses from the backend
//     const fetchAddresses = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // Make sure the token exists in localStorage
//         if (!token) {
//           setError("Authentication token is missing.");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get("http://localhost:3000/api/addresses", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data && response.data.addresses) {
//           setAddresses(response.data.addresses); // Set the retrieved addresses
//         } else {
//           setError("No addresses found.");
//         }
//       } catch (error) {
//         console.error("Error fetching addresses:", error);
//         setError("Failed to fetch addresses: " + error.message); // Handle Axios errors
//       } finally {
//         setLoading(false); // End loading state
//       }
//     };

//     fetchAddresses();
//   }, []);

//   // Render the UI
//   return (
//     <div className="address-list-container">
//       <h2>My Addresses</h2>

//       {loading && <p>Loading addresses...</p>} {/* Display loading message */}

//       {error && <p className="error-message">{error}</p>} {/* Display error message */}

//       {/* Render the list of addresses if available */}
//       {addresses.length > 0 && (
//         <ul>
//           {addresses.map((address, index) => (
//             <li key={index}>
//               <div>
//                 <strong>Address:</strong> {address.address} <br />
//                 <span>
//                   <strong>Latitude:</strong> {address.latitude} <br />
//                 </span>
//                 <span>
//                   <strong>Longitude:</strong> {address.longitude} <br />
//                 </span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AddressList;









// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AddressList = () => {
//  const [addresses, setAddresses] = useState([]);
//  const navigate = useNavigate();

//  useEffect(() => {
//    const fetchAddresses = async () => {
//      try {
//        const token = localStorage.getItem("token");
//        const response = await axios.get(
//          "http://localhost:3000/api/addresses",
//          {
//            headers: { Authorization: `Bearer ${token}` },
//          }
//        );
//        setAddresses(response.data.addresses);
//      } catch (error) {
//        console.error("Error fetching addresses:", error);
//      }
//    };
//    fetchAddresses();
//  }, []);

//  return (
//    <div className="container">
//      <h2>My Addresses</h2>
//      <ul>
//        {/* Using .map() to iterate over the addresses */}
//        {addresses.map((address, index) => (
//          <li key={index}> {/* Each list item needs a unique key */}
//            <div>
//              <strong>Address:</strong> {address.address} <br />
//              <strong>Latitude:</strong> {address.latitude} <br />
//              <strong>Longitude:</strong> {address.longitude} <br />
//            </div>
//          </li>
//        ))}
//      </ul>
//    </div>
//  );
// };

// export default AddressList;
