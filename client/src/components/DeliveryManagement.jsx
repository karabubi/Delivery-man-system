import { useState, useEffect } from "react";
import axios from "axios";
import "./DeliveryManagement.css";
const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the deliveries when the component loads
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/delivery");
        setDeliveries(response.data);
      } catch (err) {
        setError("Error fetching deliveries");
      }
    };

    fetchDeliveries();
  }, []);

  // Handle CSV upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    console.log("formData", formData);

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setError("");
      setLoading(false);
      // Refresh the list of deliveries after upload
      const response = await axios.get("http://localhost:3000/api/delivery");
      setDeliveries(response.data);
    } catch (err) {
      setError("Error uploading CSV file");
      setLoading(false);
    }
  };

  // Handle delete delivery
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/delivery/${id}`);
      setDeliveries((prevDeliveries) =>
        prevDeliveries.filter((delivery) => delivery.id !== id)
      );
    } catch (err) {
      setError("Error deleting delivery");
    }
  };

  // Handle edit delivery
  const handleEdit = async (id, newAddress) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/delivery/${id}`,
        {
          address: newAddress,
        }
      );
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === id ? response.data : delivery
        )
      );
    } catch (err) {
      setError("Error updating delivery");
    }
  };

  return (
    <div className="container">
      <h2>Delivery Management</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Upload CSV */}
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {loading && <p>Uploading...</p>}

      {/* List of Deliveries */}
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <span>{delivery.address}</span>
            <button
              onClick={() =>
                handleEdit(
                  delivery.id,
                  prompt("New Address:", delivery.address)
                )
              }
            >
              Edit
            </button>
            <button onClick={() => handleDelete(delivery.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryManagement;
