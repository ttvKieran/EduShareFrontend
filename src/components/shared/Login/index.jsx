import React, { useState } from 'react';
import API_BASE_URL from "../../../configs/system";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Fade,
  Slide,
  Avatar,
  Divider,
  Stack,
  Paper,
  useTheme,
  alpha,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School,
  ArrowBack,
} from '@mui/icons-material';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

// Tạo theme tùy chỉnh
const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626', // Đỏ hiện đại
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f8fafc', // Trắng xám nhẹ
      light: '#ffffff',
      dark: '#e2e8f0',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
            },
          },
        },
      },
    },
  },
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  // Hàm xác định route dựa trên role của user
  const getRedirectPath = (user) => {
    // Kiểm tra role của user để xác định trang đích
    if (user.role === 'lecturer' || user.role === 'teacher' || user.userType === 'lecturer') {
      return '/lecturer';
    } else if (user.role === 'student' || user.userType === 'student') {
      return '/';
    } else if (user.role === 'admin') {
      return '/admin';
    }
    
    // Fallback: dựa vào email domain hoặc pattern
    const email = user.email || formData.email;
    if (email.includes('lecturer') || email.includes('teacher') || email.includes('gv')) {
      return '/lecturer';
    }
    
    // Mặc định là sinh viên
    return '/';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Đăng nhập thành công!');
        // Lấy thông tin user từ result hoặc từ context
        const user = result.user || result.data;
        
        // Xác định đường dẫn redirect
        const redirectPath = getRedirectPath(user);
        
        // Navigate với replace để không thể quay lại trang login
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng nhập');
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      alert(`Đã gửi email khôi phục mật khẩu đến: ${forgotEmail}`);
      setIsLogin(true);
    }, 2000);
  };

  const backgroundStyle = {
    minHeight: '93.5vh',
    background: `linear-gradient(135deg, 
      ${alpha('#dc2626', 0.1)} 0%, 
      ${alpha('#ffffff', 0.9)} 50%, 
      ${alpha('#dc2626', 0.05)} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  };

  const floatingElements = (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha('#dc2626', 0.1)}, ${alpha('#dc2626', 0.2)})`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha('#dc2626', 0.15)}, ${alpha('#dc2626', 0.25)})`,
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha('#dc2626', 0.08)}, ${alpha('#dc2626', 0.18)})`,
          animation: 'float 5s ease-in-out infinite',
        }}
      />
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={backgroundStyle}>
        {floatingElements}
        
        <Fade in={true} timeout={800}>
          <Card sx={{ 
            maxWidth: 450, 
            width: '100%', 
            position: 'relative',
            overflow: 'visible',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Slide direction="down" in={true} timeout={600}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        boxShadow: `0 4px 20px ${alpha('#dc2626', 0.3)}`,
                      }}
                    >
                      <School sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {isLogin ? 'Chào mừng' : 'Khôi phục'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isLogin 
                          ? 'Hệ thống quản lý học liệu' 
                          : 'Quên mật khẩu của bạn?'
                        }
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Slide>

              <Divider sx={{ mb: 3 }} />

              {isLogin ? (
                <Slide direction="up" in={isLogin} timeout={500}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* <Typography variant='body2' sx={{m: 0}}>SV: CNV@stu.ptit.edu.vn MK: 123</Typography>
                      <Typography variant='body2' sx={{m: 0}}>GV: nguyenvana@ptit.edu.vn MK: 123</Typography> */}

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.rememberMe}
                              onChange={(e) => setFormData({
                                ...formData,
                                rememberMe: e.target.checked
                              })}
                              color="primary"
                            />
                          }
                          label="Ghi nhớ đăng nhập"
                        />
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => setIsLogin(false)}
                          sx={{ textDecoration: 'underline' }}
                        >
                          Quên mật khẩu?
                        </Button>
                      </Box>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{
                          mt: 2,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          boxShadow: `0 4px 20px ${alpha('#dc2626', 0.3)}`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            boxShadow: `0 6px 25px ${alpha('#dc2626', 0.4)}`,
                          },
                        }}
                      >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      </Button>
                    </Stack>
                  </Box>
                </Slide>
              ) : (
                <Slide direction="up" in={!isLogin} timeout={500}>
                  <Box component="form" onSubmit={handleForgotPassword}>
                    <Stack spacing={3}>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Nhập email của bạn để nhận liên kết khôi phục mật khẩu
                      </Typography>

                      <TextField
                        fullWidth
                        label="Email khôi phục"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => setIsLogin(true)}
                          startIcon={<ArrowBack />}
                        >
                          Quay lại
                        </Button>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={isLoading}
                          sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            boxShadow: `0 4px 20px ${alpha('#dc2626', 0.3)}`,
                            '&:hover': {
                              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                              boxShadow: `0 6px 25px ${alpha('#dc2626', 0.4)}`,
                            },
                          }}
                        >
                          {isLoading ? 'Đang gửi...' : 'Gửi email'}
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </Slide>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}