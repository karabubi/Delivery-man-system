import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      navigate('/delivery');
    } catch (error) {
      const errorMsg = error?.response?.data?.error || 'An error occurred.';
      alert(`Error: ${errorMsg}`);
    }
  };

  return (
    <>

    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
    </>
  );
};

export default Login;

//2----


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SignIn } from '@clerk/clerk-react';

// const Login = () => {
//   const navigate = useNavigate();

//   const handleSignInSuccess = () => {
//     alert('Login successful');
//     navigate('/delivery');
//   };

//   const handleSignInError = (error) => {
//     const errorMsg = error?.response?.data?.error || 'An error occurred.';
//     alert(`Error: ${errorMsg}`);
//   };

//   return (
//     <div className="container">
//       <h2>Login</h2>
//       <SignIn
//         path="/login"
//         routing="path"
//         afterSignInUrl="/delivery"
//         onSignInSuccess={handleSignInSuccess}
//         onSignInError={handleSignInError}
//       />
//     </div>
//   );
// };

// export default Login;
