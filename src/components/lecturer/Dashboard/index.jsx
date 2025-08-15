import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Folder as FolderIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';

const LecturerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});

  // Mock data - thay thế bằng API call thực tế
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          stats: {
            totalCourses: 5,
            totalStudents: 127,
            pendingAssignments: 8,
            documentsShared: 34
          },
          recentActivities: [
            {
              id: 1,
              type: 'assignment',
              title: 'Bài tập Toán cao cấp - Chương 3',
              description: '15 sinh viên đã nộp bài',
              time: '10 phút trước',
              status: 'pending'
            },
            {
              id: 2,
              type: 'document',
              title: 'Tài liệu bài giảng mới',
              description: 'Đã tải lên cho lớp CNTT-K65',
              time: '30 phút trước',
              status: 'completed'
            },
            {
              id: 3,
              type: 'notification',
              title: 'Thông báo lịch thi',
              description: 'Đã gửi thông báo đến 45 sinh viên',
              time: '1 giờ trước',
              status: 'completed'
            }
          ],
          upcomingSchedule: [
            {
              id: 1,
              course: 'Toán cao cấp A1',
              time: '08:00 - 09:30',
              room: 'P301',
              date: 'Hôm nay'
            },
            {
              id: 2,
              course: 'Lập trình C++',
              time: '14:00 - 15:30',
              room: 'Lab A2',
              date: 'Hôm nay'
            },
            {
              id: 3,
              course: 'Cơ sở dữ liệu',
              time: '10:00 - 11:30',
              room: 'P205',
              date: 'Ngày mai'
            }
          ],
          courseProgress: [
            {
              id: 1,
              name: 'Toán cao cấp A1',
              students: 45,
              completed: 75,
              assignments: 3,
              pendingAssignments: 1
            },
            {
              id: 2,
              name: 'Lập trình C++',
              students: 38,
              completed: 60,
              assignments: 4,
              pendingAssignments: 2
            },
            {
              id: 3,
              name: 'Cơ sở dữ liệu',
              students: 44,
              completed: 85,
              assignments: 2,
              pendingAssignments: 0
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  // Stats Cards Component
  const StatsCard = ({ icon, title, value, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: 'success.main', ml: 0.5 }}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Đang tải dữ liệu...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    // <Box>
    //   {/* Header */}
    //   <Box sx={{ mb: 4 }}>
    //     <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
    //       Chào mừng trở lại, {user?.name || 'Giảng viên'}! 👋
    //     </Typography>
    //     <Typography variant="body1" color="text.secondary">
    //       Đây là tổng quan hoạt động giảng dạy của bạn hôm nay
    //     </Typography>
    //   </Box>

    //   {/* Stats Overview */}
    //   <Grid container spacing={3} sx={{ mb: 4 }}>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <StatsCard
    //         icon={<SchoolIcon />}
    //         title="Tổng số lớp"
    //         value={dashboardData.stats?.totalCourses || 0}
    //         color="#1976d2"
    //         trend="+2 lớp mới"
    //       />
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <StatsCard
    //         icon={<PeopleIcon />}
    //         title="Tổng số sinh viên"
    //         value={dashboardData.stats?.totalStudents || 0}
    //         color="#388e3c"
    //         trend="+5 sinh viên"
    //       />
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <StatsCard
    //         icon={<AssignmentIcon />}
    //         title="Bài tập chưa chấm"
    //         value={dashboardData.stats?.pendingAssignments || 0}
    //         color="#f57c00"
    //       />
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <StatsCard
    //         icon={<FolderIcon />}
    //         title="Tài liệu đã chia sẻ"
    //         value={dashboardData.stats?.documentsShared || 0}
    //         color="#7b1fa2"
    //         trend="+3 tài liệu"
    //       />
    //     </Grid>
    //   </Grid>

    //   <Grid container spacing={3}>
    //     {/* Recent Activities */}
    //     <Grid item xs={12} md={6}>
    //       <Paper sx={{ p: 3, height: 400 }}>
    //         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    //           <Typography variant="h6" sx={{ fontWeight: 600 }}>
    //             📋 Hoạt động gần đây
    //           </Typography>
    //           <Button size="small" startIcon={<VisibilityIcon />}>
    //             Xem tất cả
    //           </Button>
    //         </Box>
            
    //         <List>
    //           {dashboardData.recentActivities?.map((activity, index) => (
    //             <React.Fragment key={activity.id}>
    //               <ListItem alignItems="flex-start">
    //                 <ListItemAvatar>
    //                   <Avatar sx={{ 
    //                     bgcolor: activity.status === 'completed' ? '#4caf50' : '#ff9800' 
    //                   }}>
    //                     {activity.status === 'completed' ? <CheckCircleIcon /> : <AccessTimeIcon />}
    //                   </Avatar>
    //                 </ListItemAvatar>
    //                 <ListItemText
    //                   primary={activity.title}
    //                   secondary={
    //                     <React.Fragment>
    //                       <Typography variant="body2" color="text.primary">
    //                         {activity.description}
    //                       </Typography>
    //                       <Typography variant="caption" color="text.secondary">
    //                         {activity.time}
    //                       </Typography>
    //                     </React.Fragment>
    //                   }
    //                 />
    //               </ListItem>
    //               {index < dashboardData.recentActivities.length - 1 && <Divider />}
    //             </React.Fragment>
    //           ))}
    //         </List>
    //       </Paper>
    //     </Grid>

    //     {/* Upcoming Schedule */}
    //     <Grid item xs={12} md={6}>
    //       <Paper sx={{ p: 3, height: 400 }}>
    //         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    //           <Typography variant="h6" sx={{ fontWeight: 600 }}>
    //             📅 Lịch giảng dạy
    //           </Typography>
    //           <Button size="small" startIcon={<AddIcon />}>
    //             Thêm lịch
    //           </Button>
    //         </Box>
            
    //         <List>
    //           {dashboardData.upcomingSchedule?.map((schedule, index) => (
    //             <React.Fragment key={schedule.id}>
    //               <ListItem>
    //                 <ListItemAvatar>
    //                   <Avatar sx={{ bgcolor: '#1976d2' }}>
    //                     <ScheduleIcon />
    //                   </Avatar>
    //                 </ListItemAvatar>
    //                 <ListItemText
    //                   primary={schedule.course}
    //                   secondary={
    //                     <Box>
    //                       <Typography variant="body2">
    //                         🕐 {schedule.time} - 📍 {schedule.room}
    //                       </Typography>
    //                       <Chip 
    //                         label={schedule.date} 
    //                         size="small" 
    //                         color={schedule.date === 'Hôm nay' ? 'primary' : 'default'}
    //                         sx={{ mt: 0.5 }}
    //                       />
    //                     </Box>
    //                   }
    //                 />
    //                 <ListItemSecondaryAction>
    //                   <IconButton edge="end">
    //                     <EditIcon />
    //                   </IconButton>
    //                 </ListItemSecondaryAction>
    //               </ListItem>
    //               {index < dashboardData.upcomingSchedule.length - 1 && <Divider />}
    //             </React.Fragment>
    //           ))}
    //         </List>
    //       </Paper>
    //     </Grid>

    //     {/* Course Progress */}
    //     <Grid item xs={12}>
    //       <Paper sx={{ p: 3 }}>
    //         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
    //           <Typography variant="h6" sx={{ fontWeight: 600 }}>
    //             📊 Tiến độ các lớp học
    //           </Typography>
    //           <Button startIcon={<AnalyticsIcon />} variant="outlined">
    //             Xem báo cáo chi tiết
    //           </Button>
    //         </Box>
            
    //         <TableContainer>
    //           <Table>
    //             <TableHead>
    //               <TableRow>
    //                 <TableCell>Tên lớp</TableCell>
    //                 <TableCell align="center">Số sinh viên</TableCell>
    //                 <TableCell align="center">Tiến độ</TableCell>
    //                 <TableCell align="center">Bài tập</TableCell>
    //                 <TableCell align="center">Cần xử lý</TableCell>
    //                 <TableCell align="center">Thao tác</TableCell>
    //               </TableRow>
    //             </TableHead>
    //             <TableBody>
    //               {dashboardData.courseProgress?.map((course) => (
    //                 <TableRow key={course.id}>
    //                   <TableCell>
    //                     <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
    //                       {course.name}
    //                     </Typography>
    //                   </TableCell>
    //                   <TableCell align="center">
    //                     <Chip 
    //                       icon={<PeopleIcon />}
    //                       label={course.students}
    //                       size="small"
    //                       color="primary"
    //                       variant="outlined"
    //                     />
    //                   </TableCell>
    //                   <TableCell align="center">
    //                     <Box sx={{ minWidth: 100 }}>
    //                       <LinearProgress 
    //                         variant="determinate" 
    //                         value={course.completed} 
    //                         sx={{ mb: 1 }}
    //                       />
    //                       <Typography variant="caption">
    //                         {course.completed}%
    //                       </Typography>
    //                     </Box>
    //                   </TableCell>
    //                   <TableCell align="center">
    //                     <Typography variant="body2">
    //                       {course.assignments} bài tập
    //                     </Typography>
    //                   </TableCell>
    //                   <TableCell align="center">
    //                     {course.pendingAssignments > 0 ? (
    //                       <Chip 
    //                         icon={<WarningIcon />}
    //                         label={`${course.pendingAssignments} bài chưa chấm`}
    //                         size="small"
    //                         color="warning"
    //                       />
    //                     ) : (
    //                       <Chip 
    //                         icon={<CheckCircleIcon />}
    //                         label="Hoàn thành"
    //                         size="small"
    //                         color="success"
    //                       />
    //                     )}
    //                   </TableCell>
    //                   <TableCell align="center">
    //                     <IconButton size="small" color="primary">
    //                       <VisibilityIcon />
    //                     </IconButton>
    //                     <IconButton size="small" color="secondary">
    //                       <EditIcon />
    //                     </IconButton>
    //                   </TableCell>
    //                 </TableRow>
    //               ))}
    //             </TableBody>
    //           </Table>
    //         </TableContainer>
    //       </Paper>
    //     </Grid>
    //   </Grid>

    //   {/* Quick Actions */}
    //   <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
    //     <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
    //       ⚡ Thao tác nhanh
    //     </Typography>
    //     <Grid container spacing={2}>
    //       <Grid item>
    //         <Button variant="contained" startIcon={<AddIcon />}>
    //           Tạo bài tập mới
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button variant="outlined" startIcon={<FolderIcon />}>
    //           Tải lên tài liệu
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button variant="outlined" startIcon={<NotificationsIcon />}>
    //           Gửi thông báo
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button variant="outlined" startIcon={<ScheduleIcon />}>
    //           Thêm lịch dạy
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </Box>
    // </Box>
    <Box></Box>
    );
};

export default LecturerDashboard;