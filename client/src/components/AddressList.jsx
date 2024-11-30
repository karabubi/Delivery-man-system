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


