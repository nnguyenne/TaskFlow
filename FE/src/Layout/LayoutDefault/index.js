import { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Drawer,
  List, ListItemIcon, ListItemText, CssBaseline, Divider,
  Tooltip, ListItemButton, Button
} from '@mui/material';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { check } from '../../Services/UserServices';
import "./Layout.scss";

const drawerWidth = 150;

export default function LayoutDefault() {
  const [open, setOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(null);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        setIsLogin(false);
        return;
      }

      const data = await check({ userID: user._id });
      setIsLogin(data.exists);
    };
    checkLogin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* APPBAR */}
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer,
        transition: 'all 0.3s',
        width: '100%',
      }}>
        <Toolbar sx={{
          ml: open ? `${drawerWidth}px` : '60px',
          transition: 'all 0.3s',
        }}>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: -1 }}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            TaskFlow
          </Typography>
          {isLogin ? (
            <Button color="inherit" onClick={handleLogout}><LogoutIcon/></Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar sx={{
          display: 'flex',
          justifyContent: open ? 'space-between' : 'center',
          alignItems: 'center',
          px: 2,
        }}>
          {open ? (
            <img src="/assets/images/logo1.png" alt="Logo Full" width={120} />
          ) : (
            <img src="/assets/images/logo2.png" alt="Logo Mini" width={30} />
          )}
        </Toolbar>
        <Divider />

        <List>

          <ListItemButton
            component={NavLink}
            to="/"
          >
            <Tooltip title="Home" placement="right" disableHoverListener={open}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
            </Tooltip>
            {open && <ListItemText primary="Home" />}
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/task"
          >
            <Tooltip title="Tasks" placement="right" disableHoverListener={open}>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
            </Tooltip>
            {open && <ListItemText primary="Tasks" />}
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/chat"
          >
            <Tooltip title="Chat" placement="right" disableHoverListener={open}>
              <ListItemIcon><ChatBubbleOutlineIcon /></ListItemIcon>
            </Tooltip>
            {open && <ListItemText primary="Chat" />}
          </ListItemButton>
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box component="main" sx={{ flexGrow: 1, p: 0 , bgcolor: '#f5f5f5'}}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
