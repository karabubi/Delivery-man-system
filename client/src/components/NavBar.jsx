import { useUser, useClerk } from "@clerk/clerk-react"; // Clerk authentication hooks
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css"; // Importing the CSS file for styling
import { SignInButton, UserButton } from "@clerk/clerk-react";

const NavBar = () => {
  const { isSignedIn } = useUser(); // Check if the user is authenticated
  const { signOut } = useClerk(); // Clerk's signOut method
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(); // Log out the user
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title">
          Delivery System
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        {!isSignedIn ? (
          <>
            <SignInButton />
          </>
        ) : (
          <>
            <Link to="/Dashboard" className="nav-link">
              Route Dashboard
            </Link>
            <Link to="/addresses" className="nav-link">
              Addresses
            </Link>
            <Link to="/manage" className="nav-link">
              Delivery Management
              </Link>
            <UserButton></UserButton>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
