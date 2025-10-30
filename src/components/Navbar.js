import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, 
  Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, useMediaQuery, useTheme 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PollIcon from '@mui/icons-material/Poll';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const menuItems = isAuthenticated ? [
    { text: 'Create Poll', icon: <AddCircleIcon />, path: '/create', color: '#10b981' },
    { text: 'My Polls', icon: <DashboardIcon />, path: '/my-polls', color: '#6366f1' },
    { text: 'Liked Polls', icon: <FavoriteIcon />, path: '/liked', color: '#ec4899' },
  ] : [];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ 
              mr: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <PollIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            <Link 
              to="/" 
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span className="gradient-text" style={{ WebkitTextFillColor: 'white' }}>
                PollMaster
              </span>
              <Box
                component="span"
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                LIVE
              </Box>
            </Link>
          </Typography>
          
          {isMobile ? (
            <IconButton 
              color="inherit" 
              onClick={() => setDrawerOpen(true)}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/create"
                    startIcon={<AddCircleIcon />}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.25)',
                      },
                    }}
                  >
                    Create Poll
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/my-polls"
                    startIcon={<DashboardIcon />}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    My Polls
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/liked"
                    startIcon={<FavoriteIcon />}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Liked
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      }}
                    >
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Button 
                      color="inherit" 
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                      sx={{
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register"
                    startIcon={<PersonAddIcon />}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#667eea',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'white',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={800}>Menu</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isAuthenticated && (
          <Box sx={{ px: 2, py: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60,
                margin: '0 auto',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 1,
              }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="body1" fontWeight={600}>{user?.username}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>{user?.email}</Typography>
          </Box>
        )}

        <List sx={{ px: 1, py: 2 }}>
          {isAuthenticated ? (
            <>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  mt: 2,
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                onClick={() => handleNavClick('/login')}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleNavClick('/register')}
                sx={{
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#667eea',
                  '&:hover': {
                    background: 'white',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#667eea', minWidth: 40 }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
