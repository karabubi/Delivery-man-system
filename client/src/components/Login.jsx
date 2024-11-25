import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', formData); //api/
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      navigate('/addresses');
    } catch (error) {
      const errorMsg = error?.response?.data?.error || 'An error occurred.';
      alert(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;



// vergin 2

// import { useState } from 'react';
// import axios from 'axios';
// import './login.css';
// const Login = () => {
//     const [formData, setFormData] = useState({ username: '', password: '' });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('/auth/login', formData);
//             localStorage.setItem('token', response.data.token);
//             alert('Login successful');
//         } catch (error) {
//             alert('Error: ' + error.response.data.error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//             <button type="submit">Login</button>
//         </form>
//     );
// };

// export default Login;
