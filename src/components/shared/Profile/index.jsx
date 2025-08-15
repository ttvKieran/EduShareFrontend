import React, { useState } from 'react';
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge
} from '@mui/material';
import {
  PhotoCamera,
  School,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Person,
  MenuBook,
  Assignment,
  TrendingUp,
  Close
} from '@mui/icons-material';

const StudentProfile = () => {
  const [profileImage, setProfileImage] = useState('/api/placeholder/150/150');
  const [openImageDialog, setOpenImageDialog] = useState(false);

  // Dữ liệu sinh viên mẫu
  const studentInfo = {
    name: 'Nguyễn Văn An',
    studentId: 'SV2021001',
    email: 'nguyenvanan@university.edu.vn',
    phone: '0123456789',
    address: 'Hà Nội, Việt Nam',
    faculty: 'Công nghệ Thông tin',
    major: 'Khoa học Máy tính',
    year: 'Năm 3',
    gpa: '3.75',
    admissionDate: '15/09/2021',
    status: 'Đang học'
  };

  const recentActivities = [
    { title: 'Tải xuống: Bài giảng Cấu trúc dữ liệu', time: '2 giờ trước', type: 'download' },
    { title: 'Xem: Video hướng dẫn Java', time: '1 ngày trước', type: 'view' },
    { title: 'Tải xuống: Đề thi mẫu', time: '3 ngày trước', type: 'download' },
    { title: 'Xem: Tài liệu Machine Learning', time: '1 tuần trước', type: 'view' }
  ];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setOpenImageDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const InfoCard = ({ icon, title, value, color = 'primary' }) => (
    <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: `${color}.light`,
          color: `${color}.main`
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            {title}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: '5px',
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: 200, 
          height: 200, 
          background: 'linear-gradient(45deg, #dc3545 0%, #ff6b7a 100%)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
          opacity: 0.1
        }} />
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} textAlign="center">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  color="primary"
                  sx={{ 
                    bgcolor: 'white', 
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  onClick={() => setOpenImageDialog(true)}
                >
                  <PhotoCamera />
                </IconButton>
              }
            >
              <Avatar
                src={profileImage}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mx: 'auto',
                  boxShadow: 3,
                  border: '4px solid white'
                }}
              />
            </Badge>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
              {studentInfo.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {studentInfo.studentId}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={studentInfo.status} 
                color="success" 
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={studentInfo.year} 
                color="primary" 
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#34495e' }}>
              {studentInfo.faculty} - {studentInfo.major}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* <Grid container spacing={4}> */}
        {/* Thông tin cá nhân */}
        {/* <Grid item xs={12} md={8}> */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: '5px', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Thông tin cá nhân
            </Typography>
            
            <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Grid item xs={12} sm={6}>
                <InfoCard 
                  icon={<Email />} 
                  title="Email" 
                  value={studentInfo.email}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoCard 
                  icon={<Phone />} 
                  title="Số điện thoại" 
                  value={studentInfo.phone}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoCard 
                  icon={<LocationOn />} 
                  title="Địa chỉ" 
                  value={studentInfo.address}
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoCard 
                  icon={<CalendarToday />} 
                  title="Ngày nhập học" 
                  value={studentInfo.admissionDate}
                  color="info"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Hoạt động gần đây */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: '5px' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Hoạt động gần đây
            </Typography>
            
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity, index) => (
                <Box key={index}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        bgcolor: activity.type === 'download' ? '#e3f2fd' : '#f3e5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: activity.type === 'download' ? '#1976d2' : '#9c27b0'
                      }}>
                        {activity.type === 'download' ? <Assignment /> : <MenuBook />}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.time}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        {/* </Grid> */}
      {/* </Grid> */}

      {/* Dialog thay đổi ảnh đại diện */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Thay đổi ảnh đại diện
          <IconButton onClick={() => setOpenImageDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Avatar
            src={profileImage}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 3 }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<PhotoCamera />}
              sx={{ 
                bgcolor: '#dc3545',
                '&:hover': { bgcolor: '#c82333' }
              }}
            >
              Chọn ảnh mới
            </Button>
          </label>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default StudentProfile;