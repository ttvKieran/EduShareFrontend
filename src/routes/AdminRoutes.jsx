import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Shared components
import Profile from '../components/shared/Profile/index.jsx';

// Temporary placeholder components cho admin
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Admin Dashboard Component
const AdminDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Bảng điều khiển Quản trị viên
    </Typography>
    
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Người dùng</Typography>
            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 600 }}>156</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <SchoolIcon sx={{ fontSize: 48, color: '#388e3c', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Môn học</Typography>
            <Typography variant="h4" sx={{ color: '#388e3c', fontWeight: 600 }}>23</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <AssessmentIcon sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Tài liệu</Typography>
            <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 600 }}>1,234</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <SecurityIcon sx={{ fontSize: 48, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Bảo mật</Typography>
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 600 }}>OK</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Hoạt động gần đây
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Danh sách hoạt động hệ thống sẽ được hiển thị ở đây.
      </Typography>
    </Paper>
  </Box>
);

// User Management Component
const UserManagement = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Quản lý Người dùng
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Đây là trang quản lý người dùng cho admin. Tính năng đang được phát triển.
    </Typography>
  </Box>
);

// System Settings Component
const SystemSettings = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Cài đặt Hệ thống
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Đây là trang cài đặt hệ thống cho admin. Tính năng đang được phát triển.
    </Typography>
  </Box>
);

// Reports Component
const Reports = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Báo cáo & Thống kê
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Đây là trang báo cáo và thống kê cho admin. Tính năng đang được phát triển.
    </Typography>
  </Box>
);

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Dashboard */}
        <Route index element={<AdminDashboard />} />
        
        {/* Quản lý người dùng */}
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:userId" element={<UserManagement />} />
        
        {/* Cài đặt hệ thống */}
        <Route path="settings" element={<SystemSettings />} />
        
        {/* Báo cáo */}
        <Route path="reports" element={<Reports />} />
        
        {/* Thông tin cá nhân */}
        <Route path="profile" element={<Profile />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;