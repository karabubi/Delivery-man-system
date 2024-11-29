
import { useState } from "react";
import axios from "axios";
import MapDisplay from "./MapDisplay";

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to add a new delivery
  const addDelivery = async () => {
    if (!address.trim()) {
      setError("Address cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/delivery", {
        address,
      });
      const newDelivery = response.data.delivery;
      console.log(address);
      setDeliveries((prev) => [...prev, newDelivery]);
      setAddress("");
      setError("");
    } catch (err) {
      setError("Error adding delivery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Delivery Management</h2>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter delivery address"
      />
      <button onClick={addDelivery} disabled={loading}>
        {loading ? "Adding..." : "Add Delivery"}
      </button>
      <MapDisplay deliveries={deliveries} />
    </div>
  );
};

export default DeliveryManagement;
