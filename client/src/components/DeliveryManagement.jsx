import { useState, useEffect } from "react";
import axios from "axios";
import "./DeliveryManagement.css";
import BackToTop from "./BackToTop";

const { VITE_API_URL } = import.meta.env;

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch deliveries from the backend
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/api/delivery`);
        if (response.data && Array.isArray(response.data.deliveries)) {
          setDeliveries(response.data.deliveries);
        } else {
          throw new Error("Unexpected response format.");
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
      const response = await axios.post(
        `${VITE_API_URL}/api/upload-csv`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setError("");
        setSuccessMessage("File uploaded successfully!");
        const deliveryResponse = await axios.get(
          `${VITE_API_URL}/api/delivery`
        );
        setDeliveries(deliveryResponse.data.deliveries);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          "Duplicate addresses found in the uploaded file. No data was saved."
        );
      } else {
        setError(
          err.response?.data?.error || "Error uploading file. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a single delivery
  const handleAddDelivery = async (newDelivery) => {
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/delivery`,
        newDelivery
      );
      setDeliveries((prev) => [...prev, response.data]);
      setSuccessMessage("Delivery added successfully!");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This address already exists in the database.");
      } else {
        setError("Error adding delivery. Please try again.");
      }
    }
  };

  // Handle deleting a single delivery
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/api/delivery/${id}`);
      setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
      setSuccessMessage("Delivery deleted successfully.");
    } catch (err) {
      setError("Error deleting delivery. Please try again.");
    }
  };

  // Handle deleting all deliveries
  const handleDeleteAll = async () => {
    try {
      await axios.delete(`${VITE_API_URL}/api/delete-all-deliveries`);
      setDeliveries([]);
      setSuccessMessage("All deliveries deleted.");
    } catch (err) {
      setError("Error deleting all deliveries. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Delivery Management</h2>
      <p>This page allows you to manage delivery addresses in your system.</p>
      <p>
        <strong>You can:-</strong>
      </p>
      <ul>
        <li>
          <strong>Upload new addresses</strong> via CSV files.
        </li>
        <li>
          <strong>Edit</strong> existing addresses.
        </li>
        <li>
          <strong>Delete</strong> unwanted delivery addresses.
        </li>
      </ul>
      <h3>
        The data should contain the following columns: [street name - latitude -
        longitude]
      </h3>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {loading && <p className="uploading-text">Uploading...</p>}

      <button className="delete-all-btn" onClick={handleDeleteAll}>
        Delete All Deliveries
      </button>

      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <span>{delivery.address}</span>
            <button
              onClick={() =>
                handleAddDelivery({
                  address: prompt("Enter new address", delivery.address),
                  positionLatitude: delivery.position_latitude,
                  positionLongitude: delivery.position_longitude,
                })
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







