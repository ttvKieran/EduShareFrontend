import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  Alert,
  CircularProgress,
  Badge,
  Tooltip,
  Stack,
  Breadcrumbs,
  Link,
  CardHeader,
  CardActions,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Fade,
  Slide,
  Zoom,
  Grow,
  Keyframes
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
  AccessTime as AccessTimeIcon,
  NavigateNext,
  Dashboard,
  Grade,
  EventNote,
  Announcement,
  CloudUpload,
  Message,
  Star,
  Person,
  Class,
  Book,
  Assignment as TaskIcon,
  Report,
  CalendarToday,
  Today,
  ExpandMore,
  Close,
  Send,
  AttachFile,
  PriorityHigh,
  Psychology as PsychologyIcon,
  EmojiEvents,
  Timeline,
  PieChart as PieChartIcon,
  TrendingDown,
  Refresh,
  MoreVert,
  PlayArrow,
  Pause,
  Stop,
  WbSunny,
  NightsStay,
  WbTwilight,
  Celebration,
  Coffee,
  LocalFlorist,
  Psychology,
  Lightbulb,
  Favorite,
  AutoAwesome,
  LibraryBooks,
  Description,
  VideoLibrary,
  Image,
  GetApp,
  Share,
  Download,
  Upload,
  MenuBook,
  Article,
  QuestionAnswer,
  Forum,
  Group,
  PersonAdd,
  Speed,
  Storage,
  CloudQueue,
  Slideshow
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [quickActionDialog, setQuickActionDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [slideIndex, setSlideIndex] = useState(0);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  // Welcome slides data
  const welcomeSlides = [
    {
      icon: <WbSunny sx={{ fontSize: 60, color: '#ff9800' }} />,
      title: "Chào buổi sáng!",
      subtitle: "Một ngày mới tràn đầy cơ hội chia sẻ kiến thức",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      time: "morning"
    },
    {
      icon: <WbTwilight sx={{ fontSize: 60, color: '#2196f3' }} />,
      title: "Chào buổi chiều!",
      subtitle: "Hy vọng bạn đã có buổi sáng giảng dạy hiệu quả",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      time: "afternoon"
    },
    {
      icon: <NightsStay sx={{ fontSize: 60, color: '#673ab7' }} />,
      title: "Chào buổi tối!",
      subtitle: "Thời gian chuẩn bị tài liệu cho ngày mai",
      gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
      time: "evening"
    }
  ];

  const motivationalQuotes = [
    "📚 Tài liệu tốt là chìa khóa mở ra tri thức",
    "🎯 Chia sẻ kiến thức là nhân đôi giá trị của nó",
    "✨ Giảng dạy hiệu quả bắt đầu từ tài liệu chất lượng",
    "🚀 Mỗi tài liệu là một cánh cửa tri thức",
    "🌟 Giáo dục số hóa - Tương lai của giảng dạy"
  ];

  const getDaySpecialMessage = () => {
    const day = currentTime.getDay();
    const dayMessages = {
      1: { emoji: "💪", message: "Thứ 2 năng lượng - Bắt đầu tuần mới với nhiều tài liệu thú vị!" },
      2: { emoji: "🎯", message: "Thứ 3 tập trung - Hoàn thiện những bài giảng chất lượng!" },
      3: { emoji: "⚡", message: "Thứ 4 động lực - Giữa tuần với tinh thần sáng tạo!" },
      4: { emoji: "🔥", message: "Thứ 5 nhiệt huyết - Chuẩn bị tài liệu cho cuối tuần!" },
      5: { emoji: "🎉", message: "Thứ 6 vui vẻ - Hoàn thành tuần giảng dạy thành công!" },
      6: { emoji: "🌈", message: "Thứ 7 thư giãn - Thời gian nghiên cứu và phát triển!" },
      0: { emoji: "☀️", message: "Chủ nhật tươi mới - Chuẩn bị cho tuần học mới!" }
    };
    return dayMessages[day] || dayMessages[1];
  };

  const getCurrentSlide = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return welcomeSlides[0]; // Morning
    if (hour >= 12 && hour < 18) return welcomeSlides[1]; // Afternoon
    return welcomeSlides[2]; // Evening
  };

  // Animation effects - chậm hơn và lâu hơn
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 8000); // Tăng từ 4s lên 8s

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000); // Tăng từ 3s lên 5s

    return () => clearInterval(slideTimer);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - tập trung vào tài liệu và lớp học
  useEffect(() => {
    const fetchDashboardData = async () => {
      setTimeout(() => {
        setDashboardData({
          stats: {
            totalCourses: 6,
            totalStudents: 247,
            totalDocuments: 142,
            documentsThisWeek: 12,
            totalDownloads: 1847,
            avgRating: 4.7,
            pendingRequests: 8,
            activeClasses: 6
          },
          weeklyDocumentStats: [
            { day: 'T2', uploaded: 3, downloaded: 45, views: 128 },
            { day: 'T3', uploaded: 5, downloaded: 62, views: 156 },
            { day: 'T4', uploaded: 2, downloaded: 38, views: 98 },
            { day: 'T5', uploaded: 4, downloaded: 71, views: 187 },
            { day: 'T6', uploaded: 3, downloaded: 55, views: 134 },
            { day: 'T7', uploaded: 1, downloaded: 28, views: 76 },
            { day: 'CN', uploaded: 0, downloaded: 15, views: 42 }
          ],
          documentTypes: [
            // { type: 'PDF', count: 68, color: '#f44336', icon: <Description /> },
            // { type: 'Video', count: 34, color: '#2196f3', icon: <VideoLibrary /> },
            // { type: 'Slide', count: 25, color: '#4caf50', icon: <Slideshow /> },
            // { type: 'Hình ảnh', count: 15, color: '#ff9800', icon: <Image /> }
            { type: 'Giáo trình', count: 68, color: '#f44336', icon: <Description /> },
            { type: 'Bài giảng', count: 34, color: '#2196f3', icon: <VideoLibrary /> },
            { type: 'Bài tập', count: 25, color: '#4caf50', icon: <Slideshow /> },
            { type: 'Tham khảo', count: 15, color: '#ff9800', icon: <Image /> },
            { type: 'Đề thi', count: 15, color: '#ff9800', icon: <Image /> },
          ],
          recentActivities: [
            {
              id: 1,
              type: 'document_upload',
              title: 'Tải lên slide Lập trình Java - Chương 5',
              description: 'Đã chia sẻ với lớp CNTT-K21A (38 sinh viên)',
              time: '5 phút trước',
              status: 'active',
              priority: 'high',
              course: 'Lập trình Java',
              icon: <CloudUpload />
            },
            {
              id: 2,
              type: 'document_download',
              title: 'Tài liệu được tải xuống',
              description: '15 lượt tải xuống bài giảng Cơ sở dữ liệu',
              time: '15 phút trước',
              status: 'completed',
              priority: 'medium',
              course: 'Cơ sở dữ liệu',
              icon: <Download />
            },
            {
              id: 3,
              type: 'feedback',
              title: 'Phản hồi từ sinh viên',
              description: 'Nhận được 5 đánh giá tích cực cho tài liệu',
              time: '25 phút trước',
              status: 'completed',
              priority: 'low',
              course: 'Toán cao cấp A1',
              icon: <Star />
            },
            {
              id: 4,
              type: 'share',
              title: 'Chia sẻ tài liệu mới',
              description: 'Video bài giảng đã được chia sẻ với 3 lớp',
              time: '1 giờ trước',
              status: 'completed',
              priority: 'high',
              course: 'Tất cả lớp',
              icon: <Share />
            },
            {
              id: 5,
              type: 'request',
              title: 'Yêu cầu tài liệu',
              description: '3 yêu cầu tài liệu mới từ sinh viên',
              time: '2 giờ trước',
              status: 'pending',
              priority: 'medium',
              course: 'Nhiều lớp',
              icon: <QuestionAnswer />
            }
          ],
          todaySchedule: [
            {
              id: 1,
              course: 'Lập trình Java',
              class: 'CNTT-K21A',
              time: '08:00 - 09:30',
              room: 'Lab A2',
              status: 'upcoming',
              students: 38,
              type: 'Thực hành',
              documentsShared: 12
            },
            {
              id: 2,
              course: 'Cơ sở dữ liệu',
              class: 'CNTT-K21B',
              time: '10:00 - 11:30',
              room: 'P205',
              status: 'current',
              students: 42,
              type: 'Lý thuyết',
              documentsShared: 8
            },
            {
              id: 3,
              course: 'Toán cao cấp A1',
              class: 'CNTT-K21C',
              time: '14:00 - 15:30',
              room: 'P301',
              status: 'upcoming',
              students: 45,
              type: 'Lý thuyết',
              documentsShared: 15
            }
          ],
          myCourses: [
            {
              id: 1,
              name: 'Lập trình Java',
              code: 'IT4043',
              students: 38,
              documents: 25,
              totalViews: 486,
              avgRating: 4.8,
              nextClass: '2025-09-01 08:00',
              image: '/api/placeholder/300/200',
              status: 'active'
            },
            {
              id: 2,
              name: 'Cơ sở dữ liệu',
              code: 'IT4045',
              students: 42,
              documents: 18,
              totalViews: 372,
              avgRating: 4.6,
              nextClass: '2025-09-01 10:00',
              image: '/api/placeholder/300/200',
              status: 'active'
            },
            {
              id: 3,
              name: 'Toán cao cấp A1',
              code: 'MA1011',
              students: 45,
              documents: 22,
              totalViews: 523,
              avgRating: 4.7,
              nextClass: '2025-09-01 14:00',
              image: '/api/placeholder/300/200',
              status: 'active'
            },
            {
              id: 4,
              name: 'Thuật toán nâng cao',
              code: 'IT4050',
              students: 35,
              documents: 31,
              totalViews: 298,
              avgRating: 4.9,
              nextClass: '2025-09-02 08:00',
              image: '/api/placeholder/300/200',
              status: 'active'
            },
            {
              id: 5,
              name: 'Lập trình Web',
              code: 'IT4409',
              students: 40,
              documents: 28,
              totalViews: 445,
              avgRating: 4.5,
              nextClass: '2025-09-03 08:00',
              image: '/api/placeholder/300/200',
              status: 'active'
            }
          ],
          notifications: [
            {
              id: 1,
              type: 'document',
              title: 'Tài liệu mới được yêu cầu',
              message: 'Sinh viên lớp CNTT-K21A yêu cầu thêm tài liệu về Exception Handling',
              time: '10 phút trước',
              read: false
            },
            {
              id: 2,
              type: 'feedback',
              title: 'Đánh giá tài liệu mới',
              message: 'Slide bài giảng Database nhận được 4.9★ từ sinh viên',
              time: '1 giờ trước',
              read: false
            },
            {
              id: 3,
              type: 'system',
              title: 'Cập nhật hệ thống',
              message: 'Tính năng chia sẻ video mới đã được cập nhật',
              time: '3 giờ trước',
              read: true
            },
            {
              id: 4,
              type: 'download',
              title: 'Tài liệu hot trong tuần',
              message: 'Slide Java OOP đã được tải xuống 50+ lần',
              time: '5 giờ trước',
              read: true
            },
            {
              id: 5,
              type: 'reminder',
              title: 'Nhắc nhở cập nhật',
              message: 'Đã 2 tuần chưa cập nhật tài liệu môn Thuật toán',
              time: '1 ngày trước',
              read: false
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  // Floating Animation Component for right side
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
            <Description sx={{ fontSize: 35, color: 'rgba(76, 175, 80, 0.6)' }} />
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
            <VideoLibrary sx={{ fontSize: 32, color: 'rgba(255, 152, 0, 0.6)' }} />
          </Box>
        </Fade>

        <Fade in={true} timeout={3500}>
          <Box
            sx={{
              position: 'absolute',
              top: '70%',
              right: '20%',
              animation: 'float-rotate 7s ease-in-out infinite 3s',
              '@keyframes float-rotate': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '33%': { transform: 'translateY(-8px) rotate(120deg)' },
                '66%': { transform: 'translateY(8px) rotate(240deg)' },
              },
            }}
          >
            <Slideshow sx={{ fontSize: 38, color: 'rgba(156, 39, 176, 0.6)' }} />
          </Box>
        </Fade>

        {/* Animated Stats Circles */}
        <Zoom in={true} timeout={4000}>
          <Box
            sx={{
              position: 'absolute',
              top: '15%',
              right: '35%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.2), rgba(33, 150, 243, 0.1))',
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
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
              {dashboardData.stats?.totalDocuments || 142}
            </Typography>
          </Box>
        </Zoom>

        {/* Floating Quote Bubble */}
        <Grow in={true} timeout={4500}>
          <Card
            sx={{
              position: 'absolute',
              top: '40%',
              right: '40%',
              maxWidth: 120,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 1.5,
              animation: 'float-bubble 8s ease-in-out infinite 4s',
              '@keyframes float-bubble': {
                '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                '25%': { transform: 'translateY(-10px) scale(1.05)' },
                '50%': { transform: 'translateY(-5px) scale(0.98)' },
                '75%': { transform: 'translateY(-12px) scale(1.02)' },
              },
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 500, color: '#1976d2' }}>
              📚 Tri thức là sức mạnh
            </Typography>
          </Card>
        </Grow>
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
          <Box sx={{ 
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            animation: 'float 8s ease-in-out infinite reverse'
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
                        {user?.fullName || 'Giảng viên'}! 👨‍🏫
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

  // Enhanced Stats Card Component
  const EnhancedStatsCard = ({ icon, title, value, subtitle, color, trend, trendValue, onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? { 
          transform: 'translateY(-4px)', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
        } : {},
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend === 'up' ? (
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />
              ) : (
                <TrendingDown sx={{ color: '#f44336', fontSize: 20 }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend === 'up' ? '#4caf50' : '#f44336',
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return '#4caf50';
      case 'upcoming': return '#2196f3';
      case 'completed': return '#9e9e9e';
      default: return '#ff9800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

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
          Đang tải dữ liệu dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>

        {/* Enhanced Welcome Banner */}
        <WelcomeBanner />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 2 }}
          >
            Làm mới
          </Button>
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setQuickActionDialog(true)}
            sx={{ borderRadius: 2, bgcolor: '#1976d2' }}
          >
            Thao tác nhanh
          </Button> */}
        </Box>
      </Box>

      {/* Enhanced Stats Overview - tập trung vào tài liệu */}
      <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} lg={3} sx={{minWidth: '300px'}}>
          <EnhancedStatsCard
            icon={<LibraryBooks />}
            title="Tổng tài liệu"
            value={dashboardData.stats?.totalDocuments || 0}
            subtitle="Đã chia sẻ với sinh viên"
            color="#1976d2"
            trend="up"
            trendValue="+12"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{minWidth: '300px'}}>
          <EnhancedStatsCard
            icon={<SchoolIcon />}
            title="Lớp tín chỉ"
            value={dashboardData.stats?.activeClasses || 0}
            subtitle="Đang hoạt động"
            color="#388e3c"
            trend="up"
            trendValue="+1"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{minWidth: '300px'}}>
          <EnhancedStatsCard
            icon={<Download />}
            title="Lượt tải xuống"
            value={dashboardData.stats?.totalDownloads || 0}
            subtitle="Tổng lượt tải tài liệu"
            color="#7b1fa2"
            trend="up"
            trendValue="+125"
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} lg={3}>
          <EnhancedStatsCard
            icon={<Star />}
            title="Đánh giá trung bình"
            value={dashboardData.stats?.avgRating || 0}
            subtitle="Từ sinh viên"
            color="#f57c00"
            trend="up"
            trendValue="+0.2"
          />
        </Grid> */}
      </Grid>

      {/* Secondary Stats */}

      <Grid container spacing={3} sx={{width: '100%', justifyContent: 'space-evenly'}}>
        {/* My Courses - 6 courses with see all button */}
        <Grid item xs={12} lg={8} sx={{widht: '100%'}}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d' }}>
                Lớp tín chỉ
              </Typography>
              <Button 
                size="small" 
                startIcon={<VisibilityIcon />}
                variant="outlined"
                sx={{ borderRadius: 2 }}
                onClick={() => {navigate('/lecturer/classes')}}
              >
                Xem tất cả
              </Button>
            </Box>
            
            <Grid container spacing={2} sx={{widht: '100%', justifyContent: 'center'}}>
              {dashboardData.myCourses?.slice(0, 6).map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id} sx={{minWidth: '200px'}}>
                  <Card sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-4px)', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
                    }
                  }}>
                    <Box sx={{ 
                      height: 120, 
                      background: `linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <SchoolIcon sx={{ fontSize: 48, color: 'white', opacity: 0.8 }} />
                      <Chip 
                        label={course.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                        size="small"
                        color={course.status === 'active' ? 'success' : 'warning'}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
                        {course.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        {course.code}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{course.students}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Description sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{course.documents}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Download sx={{ fontSize: 16, color: '#ff9800' }} />
                          <Typography variant="caption">150</Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        {course.totalViews} lượt xem
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button size="small" startIcon={<VisibilityIcon />}>
                        Chi tiết
                      </Button>
                      {/* <Button size="small" startIcon={<Upload />}>
                        Tải lên
                      </Button> */}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Today's Schedule & Quick Actions */}
        <Grid item xs={12} lg={6} sx={{minWidth: '500px'}}>
          <Stack spacing={3}>
            {/* Today's Schedule */}
            <Paper sx={{ p: 3, borderRadius: 3, minHeight: '300px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Lịch hôm nay
                </Typography>
                <Button onClick={() => {navigate('/lecturer/schedule')}}>
                  <CalendarToday sx={{ color: 'text.secondary' }} />
                </Button>
              </Box>
              
              {dashboardData.todaySchedule?.length > 0 ? (
                <Stack spacing={2}>
                  {dashboardData.todaySchedule.map((schedule) => (
                    <Card 
                      key={schedule.id} 
                      sx={{ 
                        p: 2, 
                        // border: `2px solid ${getStatusColor(schedule.status)}`,
                        // bgcolor: schedule.status === 'current' ? '#e8f5e8' : 'background.paper',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {schedule.course}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {schedule.time} • {schedule.room}
                      </Typography>
                      {/* <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={schedule.status === 'current' ? 'Đang diễn ra' : 'Sắp tới'}
                          size="small"
                          color={schedule.status === 'current' ? 'success' : 'primary'}
                        />
                        <Chip 
                          label={`${schedule.documentsShared} tài liệu`}
                          size="small"
                          variant="outlined"
                        />
                      </Box> */}
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Không có lịch giảng dạy hôm nay 😊
                </Alert>
              )}
            </Paper>

            {/* Quick Actions */}
            {/* <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Thao tác nhanh
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CloudUpload />}
                    sx={{ borderRadius: 2, py: 1.5, fontSize: '0.8rem' }}
                  >
                    Tải tài liệu
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Announcement />}
                    sx={{ borderRadius: 2, py: 1.5, fontSize: '0.8rem' }}
                  >
                    Thông báo
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LibraryBooks />}
                    sx={{ borderRadius: 2, py: 1.5, fontSize: '0.8rem' }}
                  >
                    Thư viện
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Forum />}
                    sx={{ borderRadius: 2, py: 1.5, fontSize: '0.8rem' }}
                  >
                    Thảo luận
                  </Button>
                </Grid>
              </Grid>
            </Paper> */}
          </Stack>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 390, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Thông báo
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>
                  Xem tất cả
                </Button>
              </Box>
            </Box>
            
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {dashboardData.notifications?.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: notification.type === 'document' ? '#1976d2' : 
                                notification.type === 'feedback' ? '#ff9800' : 
                                notification.type === 'download' ? '#4caf50' : '#9c27b0',
                        width: 40, height: 40
                      }}>
                        {notification.type === 'document' ? <Description /> : 
                         notification.type === 'feedback' ? <Star /> : 
                         notification.type === 'download' ? <Download /> : <NotificationsIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                          </Typography>
                        </Box>
                      }
                    />
                    {!notification.read && (
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#f44336',
                        mt: 1
                      }} />
                    )}
                  </ListItem>
                  {index < dashboardData.notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

                {/* Document Statistics - 3 separate boxes */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Grid container spacing={3} sx={{justifyContent: 'space-evenly'}}>
            {/* Weekly Activity Chart */}
            <Grid item xs={12} md={4} sx={{minWidth: '600px'}}>
              <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Hoạt động tuần
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dashboardData.weeklyDocumentStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <RechartsTooltip />
                    <Bar dataKey="uploaded" fill="#1976d2" name="Tải lên" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="downloaded" fill="#4caf50" name="Tải xuống" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Thống kê tải lên và tải xuống tài liệu trong 7 ngày qua
                </Typography>
              </Paper>
            </Grid>

            {/* Document Types Distribution */}
            <Grid item xs={12} md={4} sx={{minWidth: '500px'}}>
              <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PieChartIcon sx={{ color: '#ff9800', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Loại tài liệu
                  </Typography>
                </Box>
                
                {/* Document Type Cards */}
                <Grid container spacing={1} sx={{ mb: 2 , justifyContent: 'space-evenly'}}>
                  {dashboardData.documentTypes?.map((type, index) => (
                    <Grid item xs={6} key={index}>
                      <Card sx={{ 
                        p: 1.5, 
                        textAlign: 'center', 
                        border: `2px solid ${type.color}30`,
                        borderRadius: 2,
                        minWidth: '80px'
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

                {/* Pie Chart */}
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={dashboardData.documentTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({type, count, percent}) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.documentTypes?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value, name) => [value, 'Số lượng']} />
                  </PieChart>
                </ResponsiveContainer>
              
              </Paper>
            </Grid>

            {/* Document Performance & Views */}
          </Grid>
        </Grid>

      </Grid>

      {/* Quick Action Dialog */}
      <Dialog
        open={quickActionDialog}
        onClose={() => setQuickActionDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ⚡ Thao tác nhanh
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => setSelectedAction('upload')}
              >
                Tải tài liệu
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Announcement />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => setSelectedAction('announcement')}
              >
                Thông báo
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LibraryBooks />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => setSelectedAction('library')}
              >
                Thư viện
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Forum />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => setSelectedAction('discussion')}
              >
                Thảo luận
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ScheduleIcon />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => setSelectedAction('schedule')}
              >
                Lên lịch
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QuestionAnswer />}
                sx={{ py: 2, borderRadius: 2 }}
                onClick={() => setSelectedAction('qa')}
              >
                Hỏi đáp
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setQuickActionDialog(false)}>
            Hủy
          </Button>
          <Button variant="contained" disabled={!selectedAction}>
            Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LecturerDashboard;