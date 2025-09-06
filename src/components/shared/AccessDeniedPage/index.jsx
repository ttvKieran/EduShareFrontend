import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Fade,
  Slide,
  Zoom,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Chip,
  Card,
  CardContent,
  Avatar,
  Alert
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Block as BlockIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as SupervisorIcon,
  VerifiedUser as VerifiedUserIcon,
  GppBad as AccessDeniedIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f57c00', // Orange for access denied
      light: '#ffad42',
      dark: '#bb4d00',
    },
    secondary: {
      main: '#d32f2f', // Red for security
      light: '#ff6659',
      dark: '#9a0007',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '4rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h4: {
      fontWeight: 500,
    },
  },
});

const FloatingShield = ({ delay = 0, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Fade in={isVisible} timeout={1000}>
      <Box
        sx={{
          position: 'absolute',
          animation: `float ${duration}ms ease-in-out infinite`,
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(5deg)' },
          },
        }}
      >
        <SecurityIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
      </Box>
    </Fade>
  );
};

const GlitchText = ({ text, delay = 0 }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Typography
      variant="h1"
      component="h1"
      sx={{
        background: 'linear-gradient(45deg, #f57c00 30%, #d32f2f 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: 'center',
        mb: 2,
        fontWeight: 'bold',
        textShadow: isGlitching ? '2px 2px 4px rgba(245, 124, 0, 0.3)' : 'none',
        animation: isGlitching ? 'glitch 0.5s ease-in-out' : 'none',
        '@keyframes glitch': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%': { transform: 'translateX(-2px)' },
          '20%': { transform: 'translateX(2px)' },
          '30%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '50%': { transform: 'translateX(-2px)' },
          '60%': { transform: 'translateX(2px)' },
          '70%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
          '90%': { transform: 'translateX(-2px)' },
        },
      }}
    >
      {text}
    </Typography>
  );
};

const ParticleEffect = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <Box sx={{ position: 'relative', height: '100px', overflow: 'hidden' }}>
      {particles.map((particle) => (
        <Box
          key={particle}
          sx={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            backgroundColor: 'warning.main',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            animation: `particle-float ${3000 + Math.random() * 2000}ms ease-in-out infinite ${
              Math.random() * 2000
            }ms`,
            '@keyframes particle-float': {
              '0%': { transform: 'translateY(100px) rotate(0deg)', opacity: 0 },
              '50%': { opacity: 1 },
              '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: 0 },
            },
          }}
        />
      ))}
    </Box>
  );
};

const AccessDeniedPage = ({role}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
      const stored = sessionStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleBack = () => {
    navigate(-1);
  };

  const handleBackHome = () => {
    // Navigate based on user role
    if (user?.role === 'lecturer' || user?.userType === 'lecturer') {
      navigate('/lecturer');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getUserTypeInfo = () => {
    if (user?.role === 'lecturer' || user?.userType === 'lecturer') {
      return {
        icon: <SchoolIcon />,
        title: 'Giảng viên',
        color: '#1976d2',
        allowedPages: ['Dashboard giảng viên', 'Quản lý lớp học', 'Chấm điểm', 'Tài liệu giảng dạy']
      };
    } else if (user?.role === 'student' || user?.userType === 'student') {
      return {
        icon: <PersonIcon />,
        title: 'Sinh viên', 
        color: '#4caf50',
        allowedPages: ['Khóa học', 'Bài tập', 'Điểm số', 'Thư viện học liệu']
      };
    } else if (user?.role === 'admin') {
      return {
        icon: <AdminIcon />,
        title: 'Quản trị viên',
        color: '#9c27b0',
        allowedPages: ['Quản lý hệ thống', 'Người dùng', 'Báo cáo', 'Cấu hình']
      };
    }
    return {
      icon: <PersonIcon />,
      title: 'Người dùng',
      color: '#666',
      allowedPages: ['Trang chủ']
    };
  };

  const userInfo = getUserTypeInfo();

  const suggestions = [
    { 
      icon: <HomeIcon />, 
      text: 'Về trang chủ của bạn', 
      color: 'primary',
      action: handleBackHome
    },
    { 
      icon: <ArrowBackIcon />, 
      text: 'Quay lại trang trước', 
      color: 'secondary',
      action: handleBack
    },
    { 
      icon: <VerifiedUserIcon />, 
      text: 'Kiểm tra quyền truy cập', 
      color: 'warning',
      action: () => navigate('/profile')
    },
    { 
      icon: <SupervisorIcon />, 
      text: 'Liên hệ quản trị viên', 
      color: 'error',
      action: () => navigate('/support')
    },
  ];

  const securityTips = [
    "🔐 Mỗi vai trò người dùng có quyền truy cập khác nhau để bảo mật thông tin.",
    "🛡️ Hệ thống sẽ tự động chặn truy cập trái phép để bảo vệ dữ liệu.",
    "⚠️ Việc cố gắng truy cập trang không được phép có thể bị ghi lại.",
    "🔄 Nếu bạn cần quyền truy cập mới, hãy liên hệ quản trị viên."
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % securityTips.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #fff8e1 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating Security Icons Background */}
        <FloatingShield delay={0} duration={3000} />
        <FloatingShield delay={1000} duration={3500} />
        <FloatingShield delay={2000} duration={4000} />
        
        {/* Animated Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(245, 124, 0, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(211, 47, 47, 0.05) 0%, transparent 50%),
                         radial-gradient(circle at 40% 80%, rgba(245, 124, 0, 0.05) 0%, transparent 50%)`,
            animation: 'background-shift 10s ease-in-out infinite',
            '@keyframes background-shift': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              py: 4,
            }}
          >
            {/* User Info Alert */}
            {/* <Slide in={isLoaded} direction="down" timeout={800}>
              <Alert 
                severity="warning" 
                icon={<AccessDeniedIcon />}
                sx={{ 
                  mb: 4, 
                  borderRadius: 3,
                  boxShadow: 3,
                  '& .MuiAlert-icon': {
                    fontSize: 28
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: userInfo.color, width: 32, height: 32 }}>
                    {userInfo.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Bạn đang đăng nhập với vai trò: {user?.role}
                    </Typography>
                    <Typography variant="body2">
                      Không có quyền truy cập trang này
                    </Typography>
                  </Box>
                </Box>
              </Alert>
            </Slide> */}

            {/* Main 403 Content */}
            <Slide in={isLoaded} direction="up" timeout={1000}>
              <Paper
                elevation={8}
                sx={{
                  p: { xs: 3, md: 6 },
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                  border: '1px solid rgba(245, 124, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #f57c00, #d32f2f, #f57c00)',
                    backgroundSize: '200% 100%',
                    animation: 'gradient-shift 3s ease infinite',
                  },
                  '@keyframes gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
              >
                <Box sx={{ position: 'relative', mb: 4 }}>
                  <GlitchText text="403" delay={500} />
                  <ParticleEffect />
                </Box>

                {/* Large Security Icon */}
                <Zoom in={isLoaded} timeout={1200}>
                  <Box sx={{ mb: 3 }}>
                    <ShieldIcon sx={{ 
                      fontSize: 120, 
                      color: 'warning.main',
                      filter: 'drop-shadow(0 4px 8px rgba(245, 124, 0, 0.3))'
                    }} />
                  </Box>
                </Zoom>

                <Fade in={isLoaded} timeout={1500}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      mb: 3,
                      color: 'text.primary',
                      fontWeight: 'medium',
                    }}
                  >
                    Truy cập bị từ chối!
                  </Typography>
                </Fade>

                <Zoom in={isLoaded} timeout={2000}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      color: 'text.secondary',
                      maxWidth: '600px',
                      mx: 'auto',
                      lineHeight: 1.6,
                    }}
                  >
                    Xin lỗi! Bạn không có quyền truy cập vào trang này. Mỗi vai trò người dùng có các 
                    quyền hạn khác nhau để đảm bảo an toàn và bảo mật thông tin trong hệ thống.
                  </Typography>
                </Zoom>

                {/* User Access Info */}
                {/* <Fade in={isLoaded} timeout={2200}>
                  <Card sx={{ 
                    mb: 4, 
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                    border: `2px solid ${userInfo.color}30`
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: userInfo.color, fontWeight: 600 }}>
                        🔑 Quyền truy cập của bạn
                      </Typography>
                      <Grid container spacing={1}>
                        {userInfo.allowedPages.map((page, index) => (
                          <Grid item xs={6} sm={3} key={index}>
                            <Chip 
                              label={page}
                              size="small"
                              sx={{ 
                                bgcolor: `${userInfo.color}20`,
                                color: userInfo.color,
                                fontWeight: 500
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade> */}

                {/* Action Buttons */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={handleBackHome}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #e65100 30%, #f57c00 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(245, 124, 0, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Về Trang Chủ
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      borderColor: '#ff9800',
                      color: '#ff9800',
                      '&:hover': {
                        borderColor: '#ff9800',
                        backgroundColor: '#f57c00',
                        color: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(211, 47, 47, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Quay Lại
                  </Button>
                </Box>
              </Paper>
            </Slide>

            {/* Suggestions Grid */}
            {/* <Slide in={isLoaded} direction="up" timeout={1500}>
              <Grid container spacing={2} sx={{ mt: 4, maxWidth: '800px' }}>
                {suggestions.map((suggestion, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 12px 30px rgba(245, 124, 0, 0.2)',
                        },
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={suggestion.action}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Box
                          sx={{
                            color: hoveredCard === index ? 'warning.main' : 'text.secondary',
                            mb: 1,
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {suggestion.icon}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {suggestion.text}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Slide> */}

            {/* Security Tip Section */}
            <Fade in={isLoaded} timeout={2500}>
              <Box sx={{ mt: 6, textAlign: 'center', maxWidth: '600px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'warning.main', fontWeight: 'medium' }}>
                    Lưu ý bảo mật
                  </Typography>
                </Box>
                <Chip
                  icon={<LockIcon />}
                  label={securityTips[currentTip]}
                  sx={{
                    p: 2,
                    height: 'auto',
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      lineHeight: 1.4,
                    },
                    background: 'linear-gradient(45deg, rgba(245, 124, 0, 0.1) 30%, rgba(211, 47, 47, 0.05) 90%)',
                    border: '1px solid rgba(245, 124, 0, 0.2)',
                    transition: 'all 0.5s ease',
                  }}
                />
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AccessDeniedPage;