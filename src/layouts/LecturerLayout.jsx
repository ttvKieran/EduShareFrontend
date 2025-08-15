import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Folder as FolderIcon,
  People as PeopleIcon,
  AccountCircle,
  Logout,
  Settings,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const LecturerLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Bảng điều khiển',
      icon: <DashboardIcon />,
      path: '/lecturer'
    },
    {
      text: 'Quản lý Môn học',
      icon: <SchoolIcon />,
      path: '/lecturer/courses'
    },
    {
      text: 'Quản lý Thông báo',
      icon: <NotificationsIcon />,
      path: '/lecturer/notifications'
    },
    {
      text: 'Quản lý Tài liệu',
      icon: <FolderIcon />,
      path: '/lecturer/documents'
    },
    {
      text: 'Quản lý Sinh viên',
      icon: <PeopleIcon />,
      path: '/lecturer/students'
    }
  ];

  const drawer = (
    <Box>
      {/* Logo */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          sx={{
            height: 48,
            width: 'auto',
            maxWidth: 200
          }}
          alt="Logo"
          src="/logoBig.png"
        />
      </Box>
      
      <Divider />
      
      {/* User Info */}
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            margin: '0 auto 8px',
            bgcolor: '#1976d2',
            fontSize: '1.5rem'
          }}
        >
          {user?.name?.charAt(0).toUpperCase() || 'G'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user?.name || 'Giảng viên'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Giảng viên
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Navigation Menu */}
      <List sx={{ py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: '#e3f2fd',
                  color: '#1976d2',
                  '&:hover': {
                    bgcolor: '#e3f2fd'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? '#1976d2' : 'inherit' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: '#333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Hệ thống Quản lý Giảng dạy
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Button
              onClick={handleProfileMenuOpen}
              sx={{ 
                color: '#333',
                textTransform: 'none',
                gap: 1
              }}
            >
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.name || 'Giảng viên'}
              </Typography>
              <AccountCircle />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem onClick={() => navigate('/lecturer/profile')}>
          <Person sx={{ mr: 2 }} />
          Thông tin cá nhân
        </MenuItem>
        <MenuItem>
          <Settings sx={{ mr: 2 }} />
          Cài đặt
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2 }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LecturerLayout;