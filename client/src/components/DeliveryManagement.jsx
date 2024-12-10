
import { useState, useEffect } from "react";
import axios from "axios";
import "./DeliveryManagement.css";
import BackToTop from "./BackToTop";
const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch deliveries from the backend
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/delivery");
        
        // Log the response to understand its structure
        console.log("API Response:", response.data);

        // If response is an object with 'deliveries' array
        if (response.data && Array.isArray(response.data.deliveries)) {
          setDeliveries(response.data.deliveries);
        } else {
          throw new Error("Expected response to be an array of deliveries.");
        }
      } catch (err) {
        console.error("Error fetching deliveries:", err.message);
        setError(`Failed to fetch deliveries: ${err.message}`);
      }
    };

    fetchDeliveries();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setError("");
        setLoading(false);
        setSuccessMessage("File successfully uploaded and data has been stored!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);

        // Fetch the updated deliveries after upload
        const deliveryResponse = await axios.get("http://localhost:3000/api/delivery");
        setDeliveries(deliveryResponse.data.deliveries); // Ensure the correct array is used
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading CSV file");
      setLoading(false);
    }
  };

  // Handle deleting a single delivery
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

  // Handle deleting all deliveries
  const handleDeleteAll = async () => {
    try {
      await axios.delete("http://localhost:3000/api/delete-all-deliveries");
      setDeliveries([]); // Clear the local deliveries state
      setSuccessMessage("All deliveries have been deleted.");
      setTimeout(() => {
        setSuccessMessage(""); // Hide success message after 5 seconds
      }, 5000);
    } catch (err) {
      setError("Error deleting all deliveries");
    }
  };

  // Handle editing a delivery
  const handleEdit = async (id, newAddress) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/delivery/${id}`, { address: newAddress });
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
      <p>
        This page allows you to manage the delivery addresses in your system. You can:
      </p>
      <ul>
        <li><strong>Upload new addresses</strong> via CSV files.</li>
        <li><strong>Edit</strong> existing addresses.</li>
        <li><strong>Delete</strong> unwanted delivery addresses.</li>
      </ul>
      <h3>The data should contain the following columns: [street name - latitude - longitude]</h3>

      {error && <div className="error-message">{error}</div>}  {/* Display error if exists */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {/* Upload CSV */}
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {loading && <p className="uploading-text">Uploading...</p>}

      {/* Delete All Button */}
      <button className="delete-all-btn" onClick={handleDeleteAll}>Delete All Deliveries</button>

      {/* List of Deliveries */}
      <ul>
        {Array.isArray(deliveries) && deliveries.map((delivery) => (
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
      <BackToTop />

    </div>
  );
};

export default DeliveryManagement;
