import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Paper,
  Container,
  CircularProgress,
  IconButton,
  Fade,
  Slide,
  Zoom,
  Grow,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  Book,
  Download,
  School,
  Star,
  LibraryBooks,
  PictureAsPdf,
  VideoLibrary,
  InsertDriveFile,
  GetApp,
  Visibility,
  FolderOpen,
  ArrowForward,
  CloudDownload,
  TrendingUp,
  Timeline,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  AutoAwesome,
  WbSunny,
  WbTwilight,
  NightsStay,
  Psychology,
  EmojiEvents,
  Lightbulb,
  MenuBook,
  Description,
  Slideshow,
  Image,
  Assignment,
  Folder
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useAuth } from '../../../contexts/AuthContext';

const StudentHomepage = () => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [slideIndex, setSlideIndex] = useState(0);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [loading, setLoading] = useState(true);

  // Welcome slides data
  const welcomeSlides = [
    {
      icon: <WbSunny sx={{ fontSize: 60, color: '#ff9800' }} />,
      title: "Chào buổi sáng!",
      subtitle: "Bắt đầu ngày mới với việc học tập hiệu quả",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      time: "morning"
    },
    {
      icon: <WbTwilight sx={{ fontSize: 60, color: '#2196f3' }} />,
      title: "Chào buổi chiều!",
      subtitle: "Tiếp tục hành trình tri thức của bạn",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      time: "afternoon"
    },
    {
      icon: <NightsStay sx={{ fontSize: 60, color: '#673ab7' }} />,
      title: "Chào buổi tối!",
      subtitle: "Thời gian ôn tập và củng cố kiến thức",
      gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
      time: "evening"
    }
  ];

  const motivationalQuotes = [
    "📚 Học hỏi là hành trình không có điểm dừng",
    "🎯 Tri thức là kho báu vô giá nhất",
    "✨ Mỗi tài liệu là một cơ hội học hỏi",
    "🚀 Đầu tư cho giáo dục là đầu tư tốt nhất",
    "🌟 Kiến thức là sức mạnh thay đổi tương lai"
  ];

  const getCurrentSlide = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return welcomeSlides[0]; // Morning
    if (hour >= 12 && hour < 18) return welcomeSlides[1]; // Afternoon
    return welcomeSlides[2]; // Evening
  };

  const getDaySpecialMessage = () => {
    const day = currentTime.getDay();
    const dayMessages = {
      1: { emoji: "💪", message: "Thứ 2 năng lượng - Bắt đầu tuần học mới đầy hứng khởi!" },
      2: { emoji: "🎯", message: "Thứ 3 tập trung - Hãy tập trung vào mục tiêu học tập!" },
      3: { emoji: "⚡", message: "Thứ 4 động lực - Giữa tuần với tinh thần học hỏi cao!" },
      4: { emoji: "🔥", message: "Thứ 5 nhiệt huyết - Chuẩn bị cho những kiến thức mới!" },
      5: { emoji: "🎉", message: "Thứ 6 vui vẻ - Hoàn thành tuần học tập thành công!" },
      6: { emoji: "🌈", message: "Thứ 7 thư giãn - Thời gian ôn tập và nghiên cứu!" },
      0: { emoji: "☀️", message: "Chủ nhật tươi mới - Chuẩn bị cho tuần học mới!" }
    };
    return dayMessages[day] || dayMessages[1];
  };

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const [dashboardData] = useState({
    stats: {
      totalDocuments: 147,
      downloaded: 89,
      favorites: 23,
      recentViews: 45,
      totalCourses: 8,
      activeCourses: 6
    },
    weeklyActivity: [
      { day: 'T2', downloaded: 12, viewed: 25, favorites: 3 },
      { day: 'T3', downloaded: 8, viewed: 18, favorites: 2 },
      { day: 'T4', downloaded: 15, viewed: 32, favorites: 5 },
      { day: 'T5', downloaded: 6, viewed: 14, favorites: 1 },
      { day: 'T6', downloaded: 11, viewed: 28, favorites: 4 },
      { day: 'T7', downloaded: 4, viewed: 12, favorites: 2 },
      { day: 'CN', downloaded: 2, viewed: 8, favorites: 1 }
    ],
    documentTypes: [
      { type: 'PDF', count: 68, color: '#f44336', icon: <PictureAsPdf /> },
      { type: 'Video', count: 34, color: '#2196f3', icon: <VideoLibrary /> },
      { type: 'Slide', count: 25, color: '#4caf50', icon: <Slideshow /> },
      { type: 'Khác', count: 20, color: '#ff9800', icon: <InsertDriveFile /> }
    ],
    recentCourses: [
      {
        id: 1,
        name: 'Lập trình Web',
        code: 'IT4409',
        instructor: 'TS. Nguyễn Văn A',
        totalDocs: 24,
        downloadedDocs: 18,
        newDocs: 3,
        lastAccessed: '2025-09-06',
        color: '#f44336',
        progress: 75
      },
      {
        id: 2,
        name: 'Cơ sở dữ liệu',
        code: 'IT4045',
        instructor: 'PGS. Trần Thị B',
        totalDocs: 18,
        downloadedDocs: 12,
        newDocs: 1,
        lastAccessed: '2025-09-05',
        color: '#2196f3',
        progress: 67
      },
      {
        id: 3,
        name: 'Mạng máy tính',
        code: 'IT4062',
        instructor: 'ThS. Lê Văn C',
        totalDocs: 15,
        downloadedDocs: 8,
        newDocs: 2,
        lastAccessed: '2025-09-04',
        color: '#4caf50',
        progress: 53
      }
    ]
  });

  // Floating Animation Component
  const FloatingElements = () => {
    return (
      <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        {/* Floating Books */}
        <Fade in={true} timeout={2000}>
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              animation: 'float-up-down 4s ease-in-out infinite',
              '@keyframes float-up-down': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(-15px) rotate(5deg)' },
              },
            }}
          >
            <LibraryBooks sx={{ fontSize: 40, color: 'rgba(25, 118, 210, 0.6)' }} />
          </Box>
        </Fade>

        <Fade in={true} timeout={2500}>
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              right: '25%',
              animation: 'float-left-right 5s ease-in-out infinite 1s',
              '@keyframes float-left-right': {
                '0%, 100%': { transform: 'translateX(0px) rotate(0deg)' },
                '50%': { transform: 'translateX(10px) rotate(-5deg)' },
              },
            }}
          >
            <MenuBook sx={{ fontSize: 35, color: 'rgba(76, 175, 80, 0.6)' }} />
          </Box>
        </Fade>

        <Fade in={true} timeout={3000}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: '5%',
              animation: 'float-diagonal 6s ease-in-out infinite 2s',
              '@keyframes float-diagonal': {
                '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
                '25%': { transform: 'translate(-5px, -5px) rotate(3deg)' },
                '50%': { transform: 'translate(5px, -10px) rotate(-3deg)' },
                '75%': { transform: 'translate(-3px, 5px) rotate(2deg)' },
              },
            }}
          >
            <Assignment sx={{ fontSize: 32, color: 'rgba(255, 152, 0, 0.6)' }} />
          </Box>
        </Fade>

        {/* Animated Stats Circle */}
        <Zoom in={true} timeout={4000}>
          <Box
            sx={{
              position: 'absolute',
              top: '15%',
              right: '35%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse-scale 3s ease-in-out infinite',
              '@keyframes pulse-scale': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
              },
            }}
          >
            <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 700 }}>
              {dashboardData.stats?.totalDocuments || 147}
            </Typography>
          </Box>
        </Zoom>
      </Box>
    );
  };

  // Enhanced Welcome Banner Component
  const WelcomeBanner = () => {
    const currentSlide = getCurrentSlide();
    const dayMessage = getDaySpecialMessage();
    
    return (
      <Fade in={true} timeout={1500}>
        <Card 
          sx={{ 
            background: currentSlide.gradient,
            border: 'none',
            borderRadius: 4,
            mb: 4,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 250
          }}
        >
          {/* Decorative Background Elements */}
          <Box sx={{ 
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: 'float 6s ease-in-out infinite'
          }} />

          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Zoom in={true} timeout={1200}>
                    <Box sx={{ mr: 3 }}>
                      {currentSlide.icon}
                    </Box>
                  </Zoom>
                  
                  <Box>
                    <Slide in={true} direction="right" timeout={1500}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          background: 'linear-gradient(45deg, #1a237e 30%, #3f51b5 90%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1
                        }}
                      >
                        {currentSlide.title}
                      </Typography>
                    </Slide>
                    
                    <Slide in={true} direction="right" timeout={2000}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#424242',
                          fontWeight: 500,
                          mb: 1
                        }}
                      >
                        Chào {currentUser?.name || 'bạn'}! 🎓
                      </Typography>
                    </Slide>
                    
                    <Slide in={true} direction="right" timeout={2500}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#666',
                          fontStyle: 'italic'
                        }}
                      >
                        {currentSlide.subtitle}
                      </Typography>
                    </Slide>
                  </Box>
                </Box>

                {/* Day Special Message */}
                <Grow in={true} timeout={3000}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    p: 2,
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h4">{dayMessage.emoji}</Typography>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e' }}>
                          {dayMessage.message}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentTime.toLocaleDateString('vi-VN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grow>

                {/* Motivational Quote Carousel */}
                <Grow in={true} timeout={3500}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.8)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    p: 2,
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AutoAwesome sx={{ color: '#ff9800', fontSize: 28 }} />
                      <Fade in={true} key={slideIndex} timeout={800}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#1a237e',
                            fontStyle: 'italic'
                          }}
                        >
                          {motivationalQuotes[slideIndex]}
                        </Typography>
                      </Fade>
                    </Box>
                  </Card>
                </Grow>
              </Grid>

              {/* Right side with floating animations */}
              <Grid item xs={12} md={5}>
                <FloatingElements />
              </Grid>
            </Grid>
          </CardContent>

          {/* CSS Animation */}
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
            }
          `}</style>
        </Card>
      </Fade>
    );
  };

  // Stats Card Component
  const StatsCard = ({ icon, title, value, subtitle, color, trend, trendValue }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
        },
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp sx={{ color: '#4caf50', fontSize: 20 }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#4caf50',
                  fontWeight: 600
                }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: color,
            mb: 0.5,
            fontSize: { xs: '1.8rem', md: '2.2rem' }
          }}
        >
          {value}
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        gap: 3
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h5" color="text.secondary">
          Đang tải trang chủ...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        {/* Enhanced Welcome Banner */}
        <WelcomeBanner />

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} lg={3} sx={{minWidth: '200px'}}>
            <StatsCard
              icon={<LibraryBooks />}
              title="Tài liệu có sẵn"
              value={dashboardData.stats.totalDocuments}
              subtitle="Trong thư viện"
              color="#1976d2"
              trend="up"
              trendValue="+15"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3} sx={{minWidth: '200px'}}>
            <StatsCard
              icon={<Download />}
              title="Đã tải xuống"
              value={dashboardData.stats.downloaded}
              subtitle="Tài liệu của bạn"
              color="#4caf50"
              trend="up"
              trendValue="+8"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3} sx={{minWidth: '200px'}}>
            <StatsCard
              icon={<Star />}
              title="Yêu thích"
              value={dashboardData.stats.favorites}
              subtitle="Đã đánh dấu"
              color="#ff9800"
              trend="up"
              trendValue="+3"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3} sx={{minWidth: '200px'}}>
            <StatsCard
              icon={<School />}
              title="Môn học"
              value={dashboardData.stats.activeCourses}
              subtitle="Đang theo học"
              color="#9c27b0"
              trend="up"
              trendValue="+1"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{justifyContent: 'center'}}>
          <Grid item xs={12} >
          {/* Recent Courses - 3 courses with see all button */}
          <Grid item xs={12} lg={8} sx={{minWidth: '300px'}}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e9ecef' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d' }}>
                  📚 Môn học gần đây
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  endIcon={<ArrowForward />}
                  sx={{ 
                    borderColor: '#f44336', 
                    color: '#f44336',
                    borderRadius: 2,
                    '&:hover': { borderColor: '#d32f2f', bgcolor: '#ffebee' }
                  }}
                >
                  Xem tất cả
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {dashboardData.recentCourses.map((course) => (
                  <Grid item xs={12} md={4} key={course.id}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        border: '1px solid #f1f3f4',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
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
                          <Typography variant="caption" sx={{ color: '#6c757d', display: 'block' }}>
                            {course.code}
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
                      
                      <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                        {course.instructor}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Tiến độ tài liệu
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.downloadedDocs}/{course.totalDocs}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: course.color,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          sx={{ 
                            bgcolor: course.color,
                            '&:hover': { bgcolor: course.color + 'dd' },
                            flex: 1
                          }}
                          startIcon={<FolderOpen />}
                        >
                          Xem tài liệu
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Sidebar with Charts */}
          <Grid item xs={12} lg={4} sx={{minWidth: '300px', mt: '20px'}}>
            <Stack spacing={3}>
              {/* Quick Stats */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e9ecef' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Thống kê nhanh
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CloudDownload sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        Lượt xem tuần này
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      {dashboardData.stats.recentViews}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Download sx={{ color: '#2196f3', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        Tải xuống mới
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
                      {dashboardData.weeklyActivity.reduce((sum, day) => sum + day.downloaded, 0)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star sx={{ color: '#ff9800', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        Yêu thích mới
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800' }}>
                      {dashboardData.weeklyActivity.reduce((sum, day) => sum + day.favorites, 0)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Activity Chart */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Hoạt động 7 ngày
                  </Typography>
                </Box>
                
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dashboardData.weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <RechartsTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="viewed" 
                      stackId="1"
                      stroke="#2196f3" 
                      fill="#2196f3" 
                      fillOpacity={0.6}
                      name="Đã xem"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="downloaded" 
                      stackId="1"
                      stroke="#4caf50" 
                      fill="#4caf50" 
                      fillOpacity={0.6}
                      name="Đã tải"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Stack>
          </Grid>
          </Grid>

          {/* Document Types Distribution & Weekly Activity */}
          <Grid item xs={12}>
            <Grid container spacing={3} sx={{minWidth: '500px'}}>
              {/* Document Types */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e9ecef', height: 400 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PieChartIcon sx={{ color: '#ff9800', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Loại tài liệu
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    {dashboardData.documentTypes.map((type, index) => (
                      <Grid item xs={6} key={index}>
                        <Card sx={{ 
                          p: 1.5, 
                          textAlign: 'center', 
                          border: `2px solid ${type.color}30`,
                          borderRadius: 2
                        }}>
                          <Box sx={{ color: type.color, mb: 0.5 }}>
                            {React.cloneElement(type.icon, { fontSize: 'small' })}
                          </Box>
                          <Typography variant="h6" sx={{ color: type.color, fontWeight: 700, fontSize: '1rem' }}>
                            {type.count}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            {type.type}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dashboardData.documentTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({type, percent}) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {dashboardData.documentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value, name) => [value, 'Số lượng']} />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Weekly Detailed Activity */}
              <Grid item xs={12} md={6} sx={{minWidth: '600px'}}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e9ecef', height: 400 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Timeline sx={{ color: '#9c27b0', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Xu hướng hoạt động
                    </Typography>
                  </Box>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <RechartsTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="viewed" 
                        stroke="#2196f3" 
                        strokeWidth={3}
                        dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                        name="Lượt xem"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="downloaded" 
                        stroke="#4caf50" 
                        strokeWidth={3}
                        dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                        name="Lượt tải"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="favorites" 
                        stroke="#ff9800" 
                        strokeWidth={3}
                        dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
                        name="Yêu thích"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentHomepage;