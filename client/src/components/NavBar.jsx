
import * as React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import "./NavBar.css";

const NavBar = () => {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppBar position="static" className="MuiAppBar-root">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Hamburger Menu (Mobile View) */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              className="menu-icon-button"
            >
              <MenuIcon className="menu-icon" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {[ // Provide an array directly instead of using fragments
                <MenuItem component={Link} to="/" onClick={handleCloseNavMenu} key="home">
                  <Typography sx={{ textAlign: "center" }}>Home</Typography>
                </MenuItem>,
                isSignedIn && (
                  <MenuItem
                    key="dashboard"
                    component={Link}
                    to="/Dashboard"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography sx={{ textAlign: "center" }}>Route Dashboard</Typography>
                  </MenuItem>
                ),
                isSignedIn && (
                  <MenuItem
                    key="addresses"
                    component={Link}
                    to="/addresses"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography sx={{ textAlign: "center" }}>Addresses</Typography>
                  </MenuItem>
                ),
                isSignedIn && (
                  <MenuItem
                    key="manage"
                    component={Link}
                    to="/manage"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography sx={{ textAlign: "center" }}>Delivery Management</Typography>
                  </MenuItem>
                ),
                isSignedIn && (
                  <MenuItem
                    key="bigmap"
                    component={Link}
                    to="/bigmap"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography sx={{ textAlign: "center" }}>Big Map View</Typography>
                  </MenuItem>
                ),


                isSignedIn && (
                  <MenuItem
                    key="diagram"
                    component={Link}
                    to="/diagram"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography sx={{ textAlign: "center" }}>Diagram Viewer</Typography>
                  </MenuItem>
                ),


                isSignedIn ? (
                  <MenuItem key="signout" onClick={handleLogout}>
                    <Typography sx={{ textAlign: "center" }}>Sign Out</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem key="signin">
                    <SignInButton>
                      <Typography sx={{ textAlign: "center" }}>Sign In</Typography>
                    </SignInButton>
                  </MenuItem>
                ),
              ]}
            </Menu>
          </Box>

          {/* Navbar Title */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            className="navbar-title"
          >
            Delivery System
          </Typography>

          {/* Desktop Navigation Links */}
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className="navbar-links-left"
          >
            <Link to="/" className="nav-link">
              Home
            </Link>
            {isSignedIn ? (
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
                <Link to="/bigmap" className="nav-link">
                  Big Map View
                </Link>
                
                <div className="signIn-container">
                  <UserButton className="sign-out-button" />
                </div>
              </>
            ) : (
              <SignInButton className="sign-in-button" />
            )}
          </Box>

          {/* User Avatar Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isSignedIn ? (
                [
                  <MenuItem key="home" onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>Home</Typography>
                  </MenuItem>,
                  <MenuItem key="dashboard" onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>Dashboard</Typography>
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                  </MenuItem>,
                ]
              ) : (
                <MenuItem key="signin">
                  <SignInButton className="sign-in-button" />
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;


