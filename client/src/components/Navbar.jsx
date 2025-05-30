import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, handleLogout, checkIsAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = checkIsAdmin;
  const isAuthenticated = !!user;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const onLogout = () => {
    console.log("Logout");
    handleLogout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'} style={{ textDecoration: 'none', color: 'white' }}>
            Employee Feedback System
          </RouterLink>
        </Typography>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={handleMobileMenuToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin">
                    Dashboard
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/categories">
                    Categories
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/dashboard">
                    Dashboard
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/feedback/new">
                    Submit Feedback
                  </Button>
                </>
              )}

              <IconButton
                size="large"
                edge="end"
                aria-label="account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user?.name ? (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  {user?.name || 'User'} ({user?.role || 'user'})
                </MenuItem>
                <Divider />
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/feedback">
                Submit Feedback
              </Button>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
          sx={{ display: { md: 'none' } }}
        >
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <MenuItem component={RouterLink} to="/admin" onClick={handleMobileMenuToggle}>
                    Dashboard
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/admin/categories" onClick={handleMobileMenuToggle}>
                    Categories
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem component={RouterLink} to="/dashboard" onClick={handleMobileMenuToggle}>
                    Dashboard
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/feedback/new" onClick={handleMobileMenuToggle}>
                    Submit Feedback
                  </MenuItem>
                </>
              )}
              <Divider />
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </>
          ) : (
            <>
              <MenuItem component={RouterLink} to="/feedback" onClick={handleMobileMenuToggle}>
                Submit Feedback
              </MenuItem>
              <MenuItem component={RouterLink} to="/login" onClick={handleMobileMenuToggle}>
                Login
              </MenuItem>
              <MenuItem component={RouterLink} to="/register" onClick={handleMobileMenuToggle}>
                Register
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;