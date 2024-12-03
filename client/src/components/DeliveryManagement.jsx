
import { useState, useEffect } from "react";
import axios from "axios";
import "./DeliveryManagement.css";

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);  // Stores the list of deliveries
  const [error, setError] = useState("");           // Stores error messages
  const [loading, setLoading] = useState(false);    // Loading state for file upload

  // Fetch deliveries when the component loads
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/delivery");
        setDeliveries(response.data);  // Store deliveries in state
      } catch (err) {
        setError("Error fetching deliveries");  // Display error if the fetch fails
      }
    };

    fetchDeliveries();  // Call the function to fetch data on load
  }, []);

  // Handle CSV upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];  // Get the file selected by the user
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);  // Attach the file to FormData

    try {
      setLoading(true);  // Set loading to true while uploading
      const response = await axios.post("http://localhost:3000/api/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle the response from the server
      if (response.status === 200) {
        setError("");  // Clear error after successful upload
        setLoading(false);  // Set loading to false after upload
        alert(response.data.message);  // Show success message

        // Fetch updated deliveries after CSV upload
        const deliveryResponse = await axios.get("http://localhost:3000/api/delivery");
        setDeliveries(deliveryResponse.data);  // Update deliveries state with new data
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading CSV file");
      setLoading(false);  // Set loading to false if error occurs
    }
  };

  // Handle delete delivery
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/delivery/${id}`);  // Send delete request to the server
      setDeliveries((prevDeliveries) =>
        prevDeliveries.filter((delivery) => delivery.id !== id)  // Remove the deleted delivery from the state
      );
    } catch (err) {
      setError("Error deleting delivery");  // Show error if delete fails
    }
  };

  // Handle edit delivery
  const handleEdit = async (id, newAddress) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/delivery/${id}`,
        { address: newAddress }  // Send updated address to the server
      );
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === id ? response.data : delivery  // Update the delivery in the state with the new data
        )
      );
    } catch (err) {
      setError("Error updating delivery");  // Show error if update fails
    }
  };

  return (
    <div className="container">
      <h2>Delivery Management</h2>
      {error && <div className="error-message">{error}</div>}  {/* Display error if exists */}

      {/* Upload CSV */}
      <input type="file" accept=".csv" onChange={handleFileUpload} />  {/* File input for CSV upload */}
      {loading && <p>Uploading...</p>}  {/* Show loading text during upload */}

      {/* List of Deliveries */}
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <span>{delivery.address}</span>
            <button
              onClick={() =>
                handleEdit(
                  delivery.id,
                  prompt("New Address:", delivery.address)  // Prompt user to enter new address
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
