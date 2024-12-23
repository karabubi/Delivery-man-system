
import { useEffect, useState } from "react";
import axios from "axios";
import { SignedIn, useAuth } from "@clerk/clerk-react"; // Import Clerk components
import "./AddressList.css";
import BackToTop from "./BackToTop";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const { getToken } = useAuth(); // Get the getToken function from Clerk

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = await getToken(); // Get the authentication token
        const response = await axios.get(`${VITE_API_URL}/api/delivery`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Extract deliveries from the response
        const deliveries = response.data.deliveries.map((delivery) => ({
          address: delivery.address,
          latitude: delivery.position_latitude,
          longitude: delivery.position_longitude,
        }));
        setAddresses(deliveries);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [getToken]);

  return (
    <SignedIn>
      <div className="address-list-container">
        <h2>My Addresses</h2>
        <ul>
          {addresses.map((address, index) => (
            <li key={index}>
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
        <BackToTop />
      </div>
    </SignedIn>
  );
};

export default AddressList;