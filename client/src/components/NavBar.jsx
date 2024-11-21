
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div>
        <Link to="/register">Register</Link>
        <Link to="/login" style={{ marginLeft: '1rem' }}>Login</Link>
        <Link to="/delivery" style={{ marginLeft: '1rem' }}>Delivery</Link>
      </div>
      <div>
        <SignOutButton />
      </div>
    </nav>
  );
};

export default NavBar;
  

//-----------------------

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