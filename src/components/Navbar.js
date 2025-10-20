import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PollIcon from '@mui/icons-material/Poll';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <PollIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Real-Time Polling
          </Link>
        </Typography>
        
        <Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/create">
                Create Poll
              </Button>
              <Button color="inherit" component={Link} to="/my-polls">
                My Polls
              </Button>
              <Button color="inherit" component={Link} to="/liked">
                Liked
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout ({user?.username})
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
