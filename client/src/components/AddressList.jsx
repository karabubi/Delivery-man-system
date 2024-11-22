import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/addresses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data.addresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <div className="container">
      <h2>My Addresses</h2>
      <ul>
        {addresses.map((address, index) => (
          <li key={index}>
            {address}
            {/* Add Edit/Delete functionality if needed */}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/dashboard')}>Map View</button>
    </div>
  );
};

export default AddressList;
