
// import { Link } from 'react-router-dom';
// import { SignOutButton } from '@clerk/clerk-react';

// const NavBar = () => {
//   return (
//     <nav className="navbar">
//       <div>
//         <Link to="/login">Register</Link>
//         <Link to="/register" style={{ marginLeft: '1rem' }}>Login</Link>
        
//       </div>
//       <div>
//         <SignOutButton />
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
  
























//<Link to="/delivery" style={{ marginLeft: '1rem' }}>Delivery</Link>

// import { Link } from 'react-router-dom';
// import { SignOutButton, UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

// const NavBar = () => {
//   return (
//     <nav className="navbar">
//       <div>
//         <Link to="/">Home</Link>
//         <SignedOut>
//           <Link to="/register" style={{ marginLeft: '1rem' }}>Register</Link>
//           <Link to="/login" style={{ marginLeft: '1rem' }}>Login</Link>
//         </SignedOut>
//         <SignedIn>
//           <Link to="/delivery" style={{ marginLeft: '1rem' }}>Delivery</Link>
//           <UserButton />
//           <SignOutButton />
//         </SignedIn>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;






// vergin 23-11-24

// import { Link } from 'react-router-dom';
// import { SignOutButton } from '@clerk/clerk-react';
// import './NavBar.css'; // Importing the CSS file for styling
// const NavBar = () => {
//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <p className="navbar-title">Delivery System</p>
//       </div>
//       <div className="navbar-links">
//         <Link to="/login" className="nav-link">Login</Link>
//         <Link to="/Register" className="nav-link" >Register</Link>
//       </div>
//       <div className="navbar-signout">
//         <SignOutButton />
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

  



import { useUser, useClerk } from '@clerk/clerk-react'; // Clerk authentication hooks
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; // Importing the CSS file for styling

const NavBar = () => {
    const { isSignedIn } = useUser(); // Check if the user is authenticated
    const { signOut } = useClerk(); // Clerk's signOut method
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(); // Log out the user
        navigate('/'); // Redirect to home page after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <p className="navbar-title">Delivery System</p>
            </div>
            <div className="navbar-links">
                {!isSignedIn ? (
                    <>
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                        <Link to="/register" className="nav-link">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <button className="nav-link" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </button>
                        <button className="nav-link logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;










// import "./NavBar.css";
// import { NavLink } from "react-router-dom";
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";

// export function NavBar() {
//   return (
//     <nav className="nav-bar">
//       <ul>
//         <li>
//           <NavLink to="/">Home</NavLink>
//         </li>
//         <SignedIn>
//           <li>
//             <NavLink to="/profile">Profile</NavLink>
//           </li>
//         </SignedIn>
//         <div>
//           <SignedOut>
//             <SignInButton />
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//           {/* <li>
//             <NavLink to="/login">Login</NavLink>
//           </li>
//           <li>
//             <NavLink to="/register">Register</NavLink>
//           </li> */}
//         </div>
//       </ul>
//     </nav>
//   );
// }