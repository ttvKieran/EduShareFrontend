import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LecturerLayout from '../layouts/LecturerLayout.jsx';

// Shared components
import Profile from '../components/shared/Profile/index.jsx';
import DocumentDetail from '../components/shared/DocumentDetail/index.jsx';

// Temporary placeholder components cho lecturer
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Folder as FolderIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

// Dashboard Component
const LecturerDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Bảng điều khiển Giảng viên
    </Typography>
    
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <SchoolIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Môn học</Typography>
            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 600 }}>5</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 48, color: '#388e3c', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Sinh viên</Typography>
            <Typography variant="h4" sx={{ color: '#388e3c', fontWeight: 600 }}>127</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <FolderIcon sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Tài liệu</Typography>
            <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 600 }}>34</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Course Management Component
const CourseManagement = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Quản lý Môn học
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Đây là trang quản lý môn học cho giảng viên. Tính năng đang được phát triển.
    </Typography>
  </Box>
);

// Notification Management Component
const NotificationManagement = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Quản lý Thông báo
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Đây là trang quản lý thông báo cho giảng viên. Tính năng đang được phát triển.
    </Typography>
  </Box>
);

// Document Management Component
const DocumentManagement = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Quản lý Tài liệu
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Đây là trang quản lý tài liệu cho giảng viên. Tính năng đang được phát triển.
    </Typography>
  </Box>
);

// Student Management Component
const StudentManagement = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
      Quản lý Sinh viên
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Đây là trang quản lý sinh viên cho giảng viên. Tính năng đang được phát triển.
    </Typography>
  </Box>
);

const LecturerRoutes = () => {
  return (
    <LecturerLayout>
      <Routes>
        {/* Dashboard */}
        <Route index element={<LecturerDashboard />} />
        
        {/* Quản lý môn học */}
        <Route path="courses" element={<CourseManagement />} />
        <Route path="courses/:courseId" element={<CourseManagement />} />
        
        {/* Quản lý thông báo */}
        <Route path="notifications" element={<NotificationManagement />} />
        
        {/* Quản lý tài liệu */}
        <Route path="documents" element={<DocumentManagement />} />
        <Route path="document-detail/:documentId" element={<DocumentDetail />} />
        
        {/* Quản lý sinh viên */}
        <Route path="students" element={<StudentManagement />} />
        
        {/* Thông tin cá nhân */}
        <Route path="profile" element={<Profile />} />
      </Routes>
    </LecturerLayout>
  );
};

export default LecturerRoutes;