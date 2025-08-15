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
  CardContent
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Book as BookIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryBooksIcon,
  MenuBook as MenuBookIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
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

const FloatingBook = ({ delay = 0, duration = 3000 }) => {
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
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      >
        <BookIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
        background: 'linear-gradient(45deg, #d32f2f 30%, #000000 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: 'center',
        mb: 2,
        fontWeight: 'bold',
        textShadow: isGlitching ? '2px 2px 4px rgba(211, 47, 47, 0.3)' : 'none',
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
            backgroundColor: 'primary.main',
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

const Page404 = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const handleBack = () => {
    navigate(-1);
  };
  const handleBackHome = () => {
    navigate('/');
  };
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const suggestions = [
    { icon: <HomeIcon />, text: 'Trang chủ', color: 'primary' },
    { icon: <LibraryBooksIcon />, text: 'Thư viện học liệu', color: 'secondary' },
    { icon: <SchoolIcon />, text: 'Khóa học', color: 'primary' },
    { icon: <SearchIcon />, text: 'Tìm kiếm', color: 'secondary' },
  ];

  const funFacts = [
    "Mỗi ngày có hơn 2.5 quintillion bytes dữ liệu được tạo ra!",
    "Thư viện Alexandria cổ đại từng chứa khoảng 700,000 cuốn sách!",
    "Não bộ con người có thể lưu trữ thông tin tương đương 1 triệu gigabyte!",
    "Cuốn sách đầu tiên được in bằng máy in là Kinh Thánh Gutenberg năm 1455!"
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating Books Background */}
        <FloatingBook delay={0} duration={3000} />
        <FloatingBook delay={1000} duration={3500} />
        <FloatingBook delay={2000} duration={4000} />
        
        {/* Animated Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(211, 47, 47, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.05) 0%, transparent 50%),
                         radial-gradient(circle at 40% 80%, rgba(211, 47, 47, 0.05) 0%, transparent 50%)`,
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
            {/* Main 404 Content */}
            <Slide in={isLoaded} direction="up" timeout={1000}>
              <Paper
                elevation={8}
                sx={{
                  p: { xs: 3, md: 6 },
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(211, 47, 47, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #d32f2f, #000000, #d32f2f)',
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
                  <GlitchText text="404" delay={500} />
                  <ParticleEffect />
                </Box>

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
                    Oops! Trang bạn tìm kiếm không tồn tại
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
                    Có vẻ như trang học liệu bạn đang tìm kiếm đã bị di chuyển, xóa hoặc có thể chưa bao giờ tồn tại. 
                    Đừng lo lắng, chúng tôi sẽ giúp bạn tìm thấy những tài liệu học tập tuyệt vời khác!
                  </Typography>
                </Zoom>

                {/* Action Buttons */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    to={'/'}
                    variant="contained"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={handleBackHome}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(211, 47, 47, 0.3)',
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
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.main',
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
                          boxShadow: '0 12px 30px rgba(211, 47, 47, 0.2)',
                        },
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Box
                          sx={{
                            color: hoveredCard === index ? 'primary.main' : 'text.secondary',
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

            {/* Fun Fact Section */}
            <Fade in={isLoaded} timeout={2500}>
              <Box sx={{ mt: 6, textAlign: 'center', maxWidth: '600px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <LightbulbIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                    Bạn có biết?
                  </Typography>
                </Box>
                <Chip
                  icon={<PsychologyIcon />}
                  label={funFacts[currentFact]}
                  sx={{
                    p: 2,
                    height: 'auto',
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      lineHeight: 1.4,
                    },
                    background: 'linear-gradient(45deg, rgba(211, 47, 47, 0.1) 30%, rgba(0, 0, 0, 0.05) 90%)',
                    border: '1px solid rgba(211, 47, 47, 0.2)',
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

export default Page404;