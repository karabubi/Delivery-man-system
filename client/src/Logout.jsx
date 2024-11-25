
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="container">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;

// 2---

// import { useNavigate } from 'react-router-dom';
// import { SignOutButton } from '@clerk/clerk-react';

// const Logout = () => {
//   const navigate = useNavigate();

//   const handleLogoutSuccess = () => {
//     alert('Logged out successfully');
//     navigate('/login');
//   };

//   return (
//     <div className="container">
//       <SignOutButton signOutCallback={handleLogoutSuccess} />
//     </div>
//   );
// };

// export default Logout;
