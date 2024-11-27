// import { useState } from 'react';
// import axios from 'axios';
// import MapDisplay from './MapDisplay';
// const DeliveryManagement = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [address, setAddress] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Add Delivery Function
//   const addDelivery = async () => {
//     if (!address.trim()) {
//       setError('Address cannot be empty.');
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Unauthorized: Please log in.');

//       const response = await axios.post(
//         '/api/delivery',
//         { address },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newDelivery = response.data?.delivery;
//       if (!newDelivery) throw new Error('Failed to add delivery.');

//       setDeliveries((prev) => [...prev, newDelivery]);
//       setAddress('');
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || 'An unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Delivery Management</h2>
//       {error && <div className="error-message">{error}</div>}
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Enter delivery address"
//       />
//       <button onClick={addDelivery} disabled={loading}>
//         {loading ? 'Adding...' : 'Add Delivery'}
//       </button>
//       <MapDisplay deliveries={deliveries} />
//     </div>
//   );
// };

// export default DeliveryManagement;


// import { useState } from 'react';
// import axios from 'axios';
// import MapDisplay from './MapDisplay';

// const DeliveryManagement = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [address, setAddress] = useState('');
//   const [error, setError] = useState('');

//   const addDelivery = async () => {
//     if (!address.trim()) {
//       setError('Address cannot be empty.');
//       return;
//     }

//     try {
//       const response = await axios.post('/api/delivery', { address });
//       setDeliveries([...deliveries, response.data.delivery]);
//       setAddress('');
//       setError('');
//     } catch (err) {
//       setError('Error adding delivery');
//     }
//   };

//   return (
//     <div>
//       <h2>Delivery Management</h2>
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Enter delivery address"
//       />
//       <button onClick={addDelivery}>Add Delivery</button>
//       <MapDisplay deliveries={deliveries} />
//     </div>
//   );
// };

// export default DeliveryManagement;



// import { useState } from 'react';
// import axios from 'axios';
// import MapDisplay from './MapDisplay';

// const DeliveryManagement = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [address, setAddress] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const addDelivery = async () => {
//     if (!address.trim()) {
//       setError('Address cannot be empty.');
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Unauthorized: Please log in.');

//       const response = await axios.post(
//         '/api/delivery',
//         { address },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newDelivery = response.data?.delivery;
//       if (!newDelivery) throw new Error('Failed to add delivery.');

//       setDeliveries((prev) => [...prev, newDelivery]);
//       setAddress('');
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || 'An unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Delivery Management</h2>
//       {error && <div className="error-message">{error}</div>}
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Enter delivery address"
//       />
//       <button onClick={addDelivery} disabled={loading}>
//         {loading ? 'Adding...' : 'Add Delivery'}
//       </button>
//       <MapDisplay deliveries={deliveries} />
//     </div>
//   );
// };

// export default DeliveryManagement;



import { useState } from 'react';
import axios from 'axios';
import MapDisplay from './MapDisplay';

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to add a new delivery
  const addDelivery = async () => {
    if (!address.trim()) {
      setError('Address cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/delivery', { address });
      const newDelivery = response.data.delivery;
console.log(address)
      setDeliveries((prev) => [...prev, newDelivery]);
      setAddress('');
      setError('');
    } catch (err) {
      setError('Error adding delivery');
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
        {loading ? 'Adding...' : 'Add Delivery'}
      </button>
      <MapDisplay deliveries={deliveries} />
    </div>
  );
};

export default DeliveryManagement;
