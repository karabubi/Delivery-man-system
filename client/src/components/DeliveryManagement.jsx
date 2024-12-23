
import { useState, useEffect } from "react";
import axios from "axios";
import { SignedIn, useAuth } from "@clerk/clerk-react"; // Import Clerk components
import "./DeliveryManagement.css";
import BackToTop from "./BackToTop";

const { VITE_API_URL } = import.meta.env;

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { getToken } = useAuth(); // Get the getToken function from Clerk

  // Fetch deliveries from the backend
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = await getToken(); // Get the authentication token
        console.log(
          "Fetching deliveries from:",
          `${VITE_API_URL}/api/delivery`
        );
        const response = await axios.get(`${VITE_API_URL}/api/delivery`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Deliveries response:", response);
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
  }, [getToken]);
  console.log("token getToken", getToken);

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
      const token = await getToken(); // Get the authentication token
      console.log("Uploading CSV to:", `${VITE_API_URL}/api/upload-csv`);
      const response = await axios.post(
        `${VITE_API_URL}/api/upload-csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setError("");
        setSuccessMessage("File uploaded successfully!");
        const deliveryResponse = await axios.get(
          `${VITE_API_URL}/api/delivery`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
      const token = await getToken(); // Get the authentication token
      console.log("Adding delivery to:", `${VITE_API_URL}/api/delivery`);
      const response = await axios.post(
        `${VITE_API_URL}/api/delivery`,
        newDelivery,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  // Handle updating a single delivery
  const handleUpdateDelivery = async (id, updatedDelivery) => {
    try {
      const token = await getToken(); // Get the authentication token
      console.log(
        "Updating delivery at:",
        `${VITE_API_URL}/api/delivery/${id}`
      );
      const response = await axios.put(
        `${VITE_API_URL}/api/delivery/${id}`,
        updatedDelivery,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === id ? { ...delivery, ...response.data } : delivery
        )
      );
      setSuccessMessage("Delivery updated successfully!");
    } catch (err) {
      setError("Error updating delivery. Please try again.");
    }
  };

  // Handle deleting a single delivery
  const handleDelete = async (id) => {
    try {
      const token = await getToken(); // Get the authentication token
      console.log(
        "Deleting delivery at:",
        `${VITE_API_URL}/api/delivery/${id}`
      );
      await axios.delete(`${VITE_API_URL}/api/delivery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
      setSuccessMessage("Delivery deleted successfully.");
    } catch (err) {
      setError("Error deleting delivery. Please try again.");
    }
  };

  // Handle deleting all deliveries
  const handleDeleteAll = async () => {
    try {
      const token = await getToken(); // Get the authentication token
      console.log(
        "Deleting all deliveries at:",
        `${VITE_API_URL}/api/delete-all-deliveries`
      );
      await axios.delete(`${VITE_API_URL}/api/delete-all-deliveries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeliveries([]);
      setSuccessMessage("All deliveries deleted.");
    } catch (err) {
      setError("Error deleting all deliveries. Please try again.");
    }
  };

  return (
    <SignedIn>
      <div className="container">
        <h2>Delivery Management</h2>
        <p>This page allows you to manage delivery addresses in your system.</p>
        <ul>
          <li>
            <strong>Upload</strong> new addresses via CSV files.
          </li>
          <li>
            <strong>Edit</strong> existing addresses.
          </li>
          <li>
            <strong>Delete</strong> unwanted delivery addresses.
          </li>
        </ul>

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
                onClick={() => {
                  const updatedAddress = prompt(
                    "Enter updated address",
                    delivery.address
                  );
                  const updatedLatitude = prompt(
                    "Enter updated latitude",
                    delivery.position_latitude
                  );
                  const updatedLongitude = prompt(
                    "Enter updated longitude",
                    delivery.position_longitude
                  );
                  handleUpdateDelivery(delivery.id, {
                    address: updatedAddress || delivery.address,
                    positionLatitude:
                      updatedLatitude || delivery.position_latitude,
                    positionLongitude:
                      updatedLongitude || delivery.position_longitude,
                  });
                }}
              >
                Update
              </button>
              <button onClick={() => handleDelete(delivery.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <BackToTop />
      </div>
    </SignedIn>
  );
};

export default DeliveryManagement;

