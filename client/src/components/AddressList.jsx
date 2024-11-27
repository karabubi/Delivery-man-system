import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <-- It is not used. It would be better to delete it

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate(); // <-- It is not used. It would be better to delete it

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
    <div className="container">
      <h2>My Addresses</h2>
      <ul>
        {/* Using .map() to iterate over the addresses */}
        {addresses.map((address, index) => (
          <li key={index}>
            {" "}
            {/* Each list item needs a unique key */}
            <div>
              <strong>Address:</strong> {address.address} <br />
              <strong>Latitude:</strong> {address.latitude} <br />
              <strong>Longitude:</strong> {address.longitude} <br />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressList;
