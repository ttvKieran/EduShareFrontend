import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Container,
  CircularProgress
} from '@mui/material';
import {
  Book,
  Download,
  Assignment,
  School,
  Folder,
  Star,
  TrendingUp,
  Notifications,
  PlayArrow,
  CheckCircle,
  RadioButtonUnchecked,
  Group,
  EmojiEvents,
  BookmarkAdd,
  Timeline,
  LibraryBooks,
  PictureAsPdf,
  VideoLibrary,
  InsertDriveFile,
  GetApp,
  Visibility,
  FolderOpen,
  ArrowForward,
  AccessTime,
  CloudDownload
} from '@mui/icons-material';

const StudentHomepage = () => {
  const [quickActions] = useState([
    { icon: <Book />, title: 'Tài liệu mới', count: 12, color: '#f44336' },
    { icon: <Download />, title: 'Tải xuống', count: 8, color: '#4caf50' },
    { icon: <Folder />, title: 'Thư mục', count: 15, color: '#2196f3' },
    { icon: <Star />, title: 'Yêu thích', count: 6, color: '#ff9800' }
  ]);

  const [documentStats] = useState({
    totalDocuments: 147,
    downloaded: 89,
    favorites: 23,
    recentViews: 15
  });

  const [recentDocuments] = useState([
    { 
      id: 1, 
      title: 'Bài giảng Lập trình Web - Chương 3', 
      course: 'Lập trình Web',
      type: 'pdf',
      size: '2.4 MB',
      downloadCount: 45,
      uploadDate: '2025-07-05',
      isNew: true,
      progress: 75
    },
    { 
      id: 2, 
      title: 'Thực hành JavaScript ES6+', 
      course: 'Lập trình Web',
      type: 'pdf',
      size: '1.8 MB',
      downloadCount: 32,
      uploadDate: '2025-07-04',
      isNew: false,
      progress: 100
    },
    { 
      id: 3, 
      title: 'Video hướng dẫn React Hooks', 
      course: 'Lập trình Web',
      type: 'video',
      size: '156 MB',
      downloadCount: 78,
      uploadDate: '2025-07-03',
      isNew: true,
      progress: 30
    },
    { 
      id: 4, 
      title: 'Bài tập thực hành Database', 
      course: 'Cơ sở dữ liệu',
      type: 'doc',
      size: '890 KB',
      downloadCount: 21,
      uploadDate: '2025-07-02',
      isNew: false,
      progress: 0
    }
  ]);

  const [courseDocuments] = useState([
    { 
      id: 1, 
      name: 'Lập trình Web', 
      totalDocs: 24,
      newDocs: 3,
      downloadedDocs: 18,
      instructor: 'TS. Nguyễn Văn A',
      color: '#f44336'
    },
    { 
      id: 2, 
      name: 'Cơ sở dữ liệu', 
      totalDocs: 18,
      newDocs: 1,
      downloadedDocs: 12,
      instructor: 'PGS. Trần Thị B',
      color: '#2196f3'
    },
    { 
      id: 3, 
      name: 'Mạng máy tính', 
      totalDocs: 15,
      newDocs: 2,
      downloadedDocs: 8,
      instructor: 'ThS. Lê Văn C',
      color: '#4caf50'
    },
    { 
      id: 4, 
      name: 'Kỹ thuật phần mềm', 
      totalDocs: 22,
      newDocs: 0,
      downloadedDocs: 15,
      instructor: 'TS. Phạm Văn D',
      color: '#ff9800'
    }
  ]);

  const [recentActivities] = useState([
    { id: 1, type: 'download', title: 'Tải xuống bài giảng React Components', time: '2 giờ trước', course: 'Lập trình Web' },
    { id: 2, type: 'view', title: 'Xem tài liệu SQL Advanced', time: '4 giờ trước', course: 'Cơ sở dữ liệu' },
    { id: 3, type: 'favorite', title: 'Đã thêm vào yêu thích', time: '1 ngày trước', course: 'Mạng máy tính' },
    { id: 4, type: 'upload', title: 'Tài liệu mới được thêm', time: '2 ngày trước', course: 'Kỹ thuật phần mềm' }
  ]);

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <PictureAsPdf sx={{ color: '#f44336' }} />;
      case 'video': return <VideoLibrary sx={{ color: '#2196f3' }} />;
      case 'doc': return <InsertDriveFile sx={{ color: '#4caf50' }} />;
      default: return <Book sx={{ color: '#666' }} />;
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'download': return <CloudDownload sx={{ color: '#4caf50' }} />;
      case 'view': return <Visibility sx={{ color: '#2196f3' }} />;
      case 'favorite': return <Star sx={{ color: '#ff9800' }} />;
      case 'upload': return <BookmarkAdd sx={{ color: '#f44336' }} />;
      default: return <Timeline />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        {/* Welcome Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: '2px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e3e6f0'
          }}
        >
          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                Thư viện tài liệu học tập
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: '2px', border: '1px solid #e9ecef' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#f44336' }}>
                      {documentStats.totalDocuments}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Tổng tài liệu
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: '2px', border: '1px solid #e9ecef' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      {documentStats.downloaded}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Đã tải xuống
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: '2px', border: '1px solid #e9ecef' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff9800' }}>
                      {documentStats.favorites}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Yêu thích
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: '2px', border: '1px solid #e9ecef' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2196f3' }}>
                      {documentStats.recentViews}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Xem gần đây
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LibraryBooks sx={{ fontSize: '3rem', color: '#fff' }} />
                </Box>
                {/* <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 600 }}>
                  Hệ thống tài liệu
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  Truy cập mọi lúc, mọi nơi
                </Typography> */}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        {/* <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  cursor: 'pointer',
                  borderRadius: '2px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: action.color
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: action.color, width: 56, height: 56 }}>
                      {action.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        {action.count}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 500 }}>
                        {action.title}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: action.color,
                      bgcolor: `${action.color}15`,
                      '&:hover': { bgcolor: `${action.color}25` }
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid> */}

        <Grid container spacing={4}>
          {/* Documents by Course */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '2px', border: '1px solid #e9ecef' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                  Tài liệu theo môn học
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  endIcon={<ArrowForward />}
                  sx={{ 
                    borderColor: '#f44336', 
                    color: '#f44336',
                    borderRadius: '2px',
                    '&:hover': { borderColor: '#d32f2f', bgcolor: '#ffebee' }
                  }}
                >
                  Xem tất cả
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {courseDocuments.map((course) => (
                  <Grid item xs={12} sm={6} key={course.id}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        borderRadius: '2px',
                        border: '1px solid #f1f3f4',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          borderColor: course.color
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: course.color, width: 48, height: 48 }}>
                          <School />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                            {course.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6c757d' }}>
                            {course.instructor}
                          </Typography>
                        </Box>
                        {course.newDocs > 0 && (
                          <Chip 
                            label={`${course.newDocs} mới`} 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f44336', 
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }} 
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: course.color }}>
                              {course.totalDocs}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6c757d' }}>
                              Tổng số
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                              {course.downloadedDocs}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6c757d' }}>
                              Đã tải
                            </Typography>
                          </Box>
                        </Box>
                        <CircularProgress
                          variant="determinate"
                          value={(course.downloadedDocs / course.totalDocs) * 100}
                          size={40}
                          thickness={4}
                          sx={{
                            color: course.color,
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                            },
                          }}
                        />
                      </Box>
                      
                      <Button 
                        variant="text" 
                        size="small" 
                        endIcon={<FolderOpen />}
                        sx={{ 
                          color: course.color,
                          fontWeight: 600,
                          '&:hover': { bgcolor: `${course.color}10` }
                        }}
                      >
                        Mở thư mục
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Recent Documents */}
            {/* <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: '2px', border: '1px solid #e9ecef' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                  Tài liệu gần đây
                </Typography>
                <Button 
                  variant="text" 
                  size="small" 
                  endIcon={<ArrowForward />}
                  sx={{ color: '#f44336', fontWeight: 600 }}
                >
                  Xem thêm
                </Button>
              </Box>
              
              <List sx={{ p: 0 }}>
                {recentDocuments.map((doc, index) => (
                  <React.Fragment key={doc.id}>
                    <ListItem 
                      sx={{ 
                        px: 0, 
                        py: 2,
                        borderRadius: '2px',
                        '&:hover': { bgcolor: '#f8f9fa' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 50 }}>
                        {getFileIcon(doc.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                              {doc.title}
                            </Typography>
                            {doc.isNew && (
                              <Chip 
                                label="Mới" 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#f44336', 
                                  color: '#fff',
                                  fontSize: '0.7rem',
                                  height: 20
                                }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#6c757d', mb: 0.5 }}>
                              {doc.course} • {doc.size} • {doc.downloadCount} lượt tải
                            </Typography>
                            {doc.progress > 0 && (
                              <LinearProgress 
                                variant="determinate" 
                                value={doc.progress} 
                                sx={{ 
                                  height: 4, 
                                  borderRadius: '2px',
                                  bgcolor: '#e9ecef',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: doc.progress === 100 ? '#4caf50' : '#2196f3'
                                  }
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: '#2196f3' }}>
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#4caf50' }}>
                          <GetApp />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < recentDocuments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper> */}
          </Grid>

          {/* Right Sidebar */}
          {/* <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '2px', border: '1px solid #e9ecef' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                    Hoạt động gần đây
                  </Typography>
                  
                  <List sx={{ p: 0 }}>
                    {recentActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getActivityIcon(activity.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', lineHeight: 1.4 }}>
                                {activity.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500 }}>
                                  {activity.course}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#adb5bd', ml: 1 }}>
                                  • {activity.time}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < recentActivities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '2px', border: '1px solid #e9ecef' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                    Thống kê nhanh
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        Tài liệu đã tải
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {documentStats.downloaded}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        Yêu thích
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800' }}>
                        {documentStats.favorites}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        Xem tuần này
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
                        {documentStats.recentViews}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentHomepage;