import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  Alert,
  Tooltip,
  Fab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  TablePagination,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Folder as FolderIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Grade as GradeIcon,
  Group as GroupIcon,
  BookIcon,
  Quiz as QuizIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Class as ClassIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentsDialog from '../StudentsDialog'; // Import component riêng

// ... other imports remain the same

const CourseManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("refresh main");
  
  // States
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [viewMode, setViewMode] = useState('semester');
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  
  // Students modal states
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Form states
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    semester: '',
    credits: 3,
    maxStudents: 50,
    status: 'draft'
  });

  const prevStates = useRef({});
  
  useEffect(() => {
    const currentStates = {
      courses: courses.length,
      loading,
      searchQuery,
      selectedSemester,
      viewMode,
      expandedSemesters: JSON.stringify(expandedSemesters),
      anchorEl: !!anchorEl,
      selectedCourse: selectedCourse?.id,
      createDialogOpen,
      editDialogOpen,
      deleteDialogOpen,
      studentsDialogOpen,
      students: students.length,
      studentsLoading,
      studentSearchQuery,
      page,
      rowsPerPage,
      selectedStudents: selectedStudents.length
    };

    Object.keys(currentStates).forEach(key => {
      if (prevStates.current[key] !== currentStates[key]) {
        console.log(`🔄 State changed - ${key}:`, {
          from: prevStates.current[key],
          to: currentStates[key]
        });
      }
    });

    prevStates.current = currentStates;
  });

  // Mock data for students
  const mockStudents = [
    {
      id: 1,
      stt: 1,
      studentCode: 'B22DCCN007',
      fullName: 'Trần Quốc An',
      birthDate: '13/07/2004',
      className: 'D22CNPM03'
    },
    {
      id: 2,
      stt: 2,
      studentCode: 'B22DCCN018',
      fullName: 'Hoa Đức Anh',
      birthDate: '20/10/2004',
      className: 'D22CNPM03'
    },
    {
      id: 3,
      stt: 3,
      studentCode: 'B22DCCN030',
      fullName: 'Nguyễn Quang Anh',
      birthDate: '10/08/2004',
      className: 'D22CNPM03'
    },
    {
      id: 4,
      stt: 4,
      studentCode: 'B22DCCN042',
      fullName: 'Phan Tuấn Anh',
      birthDate: '31/07/2004',
      className: 'D22CNPM03'
    },
    {
      id: 5,
      stt: 5,
      studentCode: 'B22DCCN053',
      fullName: 'Đỗ Xuân Bách',
      birthDate: '24/11/2004',
      className: 'D22CNPM03'
    },
    {
      id: 6,
      stt: 6,
      studentCode: 'B22DCCN054',
      fullName: 'Hoàng Xuân Bách',
      birthDate: '23/07/2004',
      className: 'D22CNPM03'
    },
    {
      id: 7,
      stt: 7,
      studentCode: 'B22DCCN055',
      fullName: 'Phùng Đức Bách',
      birthDate: '17/05/2004',
      className: 'D22CNPM03'
    },
    {
      id: 8,
      stt: 8,
      studentCode: 'B22DCCN078',
      fullName: 'Phan Văn Biên',
      birthDate: '03/08/2004',
      className: 'D22CNPM03'
    },
    {
      id: 9,
      stt: 9,
      studentCode: 'B22DCCN079',
      fullName: 'Bùi Văn Bình',
      birthDate: '16/09/2004',
      className: 'D22CNPM03'
    },
    {
      id: 10,
      stt: 10,
      studentCode: 'B22DCCN115',
      fullName: 'Trần Đức Chánh',
      birthDate: '11/10/2004',
      className: 'D22CNPM03'
    },
    {
      id: 11,
      stt: 11,
      studentCode: 'B22DCCN089',
      fullName: 'Nguyễn Sỹ Công',
      birthDate: '28/09/2004',
      className: 'D22CNPM03'
    },
    {
      id: 12,
      stt: 12,
      studentCode: 'B22DCCN103',
      fullName: 'Vũ Văn Cường',
      birthDate: '27/03/2004',
      className: 'D22CNPM03'
    },
    {
      id: 13,
      stt: 13,
      studentCode: 'B22DCCN125',
      fullName: 'Hà Minh Đăng',
      birthDate: '12/05/2004',
      className: 'D22CNPM03'
    },
    {
      id: 14,
      stt: 14,
      studentCode: 'B22DCCN137',
      fullName: 'Phùng Đình Đăng',
      birthDate: '15/10/2003',
      className: 'D22CNPM03'
    },
    {
      id: 15,
      stt: 15,
      studentCode: 'B22DCCN149',
      fullName: 'Mac Đức Duy',
      birthDate: '14/06/2004',
      className: 'D22CNPM03'
    },
    {
      id: 16,
      stt: 16,
      studentCode: 'B22DCCN198',
      fullName: 'Nguyễn Thủ Đat',
      birthDate: '15/12/2002',
      className: 'D22CNPM03'
    },
    {
      id: 17,
      stt: 17,
      studentCode: 'B22DCCN221',
      fullName: 'Đào Ngọc Đức',
      birthDate: '14/06/2004',
      className: 'D22CNPM03'
    },
    {
      id: 18,
      stt: 18,
      studentCode: 'B22DCCN222',
      fullName: 'Đào Trung Đức',
      birthDate: '23/10/2004',
      className: 'D22CNPM03'
    },
    {
      id: 19,
      stt: 19,
      studentCode: 'B22DCCN246',
      fullName: 'Tiến Văn Gác',
      birthDate: '01/09/2004',
      className: 'D22CNPM03'
    },
    {
      id: 20,
      stt: 20,
      studentCode: 'B22DCCN258',
      fullName: 'Nguyễn Hữu Hà',
      birthDate: '20/11/2004',
      className: 'D22CNPM03'
    },
    {
      id: 21,
      stt: 21,
      studentCode: 'B22DCCN281',
      fullName: 'Võ Thị Thu Hằng',
      birthDate: '24/09/2004',
      className: 'D22CNPM03'
    },
    {
      id: 22,
      stt: 22,
      studentCode: 'B22DCCN293',
      fullName: 'Trần Đình Hiển',
      birthDate: '11/07/2004',
      className: 'D22CNPM03'
    },
    {
      id: 23,
      stt: 23,
      studentCode: 'B20DCCN241',
      fullName: 'Bùi Trung Hiếu',
      birthDate: '11/03/2002',
      className: 'D20HTT1'
    },
    {
      id: 24,
      stt: 24,
      studentCode: 'B22DCCN330',
      fullName: 'Đào Huy Hoàng',
      birthDate: '01/01/2004',
      className: 'D22CNPM03'
    },
    {
      id: 25,
      stt: 25,
      studentCode: 'B22DCCN365',
      fullName: 'Ngư Quang Hùng',
      birthDate: '20/02/2004',
      className: 'D22CNPM03'
    }
  ];

  // Mock data with more realistic semester structure
  const mockCourses = [
    {
      id: 1,
      name: 'Lập trình hướng đối tượng',
      code: 'IT3103',
      description: 'Học lập trình hướng đối tượng với Java',
      semester: '2024.1',
      semesterName: 'Học kỳ I năm 2024-2025',
      credits: 3,
      maxStudents: 50,
      enrolledStudents: 42,
      status: 'active',
      progress: 65,
      assignments: 8,
      documents: 15,
      lastUpdated: '2024-08-10T10:30:00Z',
      schedule: [
        { day: 'Thứ 2', time: '08:00-09:30', room: 'Lab A2' },
        { day: 'Thứ 4', time: '08:00-09:30', room: 'Lab A2' }
      ],
      avgGrade: 7.8,
      completedLessons: 13,
      totalLessons: 20,
      nextClass: '2024-08-15T08:00:00Z'
    },
    {
      id: 2,
      name: 'Cơ sở dữ liệu',
      code: 'IT3090',
      description: 'Thiết kế và quản lý cơ sở dữ liệu',
      semester: '2024.1',
      semesterName: 'Học kỳ I năm 2024-2025',
      credits: 4,
      maxStudents: 45,
      enrolledStudents: 38,
      status: 'active',
      progress: 80,
      assignments: 6,
      documents: 22,
      lastUpdated: '2024-08-09T14:20:00Z',
      schedule: [
        { day: 'Thứ 3', time: '14:00-16:30', room: 'P205' },
        { day: 'Thứ 5', time: '14:00-16:30', room: 'P205' }
      ],
      avgGrade: 8.2,
      completedLessons: 16,
      totalLessons: 20,
      nextClass: '2024-08-16T14:00:00Z'
    },
    // ... other courses remain the same
  ];

  useEffect(() => {
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
      const currentSemester = getCurrentSemester();
      setExpandedSemesters({ [currentSemester]: true });
    }, 1000);
  }, []);

  // Helper functions
  const getCurrentSemester = () => {
    return '2024.1';
  };

  const getSemesters = () => {
    const semesterMap = {};
    courses.forEach(course => {
      if (!semesterMap[course.semester]) {
        semesterMap[course.semester] = {
          id: course.semester,
          name: course.semesterName,
          courses: []
        };
      }
      semesterMap[course.semester].courses.push(course);
    });
    
    return Object.values(semesterMap).sort((a, b) => b.id.localeCompare(a.id));
  };

  // 🔍 KIỂM TRA CÁC DEPENDENCIES CỦA useMemo VÀ useCallback
  const getFilteredStudents = useMemo(() => {
    console.log('📊 getFilteredStudents recalculated');
    return students.filter(student =>
      student.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.className.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  }, [students, studentSearchQuery]);

  const paginatedStudents = useMemo(() => {
    console.log('📊 paginatedStudents recalculated');
    return getFilteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [getFilteredStudents, page, rowsPerPage]);

  // Event handlers
  const handleSearchStudent = useCallback((e) => {
    console.log('🔍 handleSearchStudent called with:', e.target.value);
    setStudentSearchQuery(e.target.value);
    setPage(0);
  }, []);

  const handleSelectStudent = useCallback((event, id) => {
    console.log('✅ handleSelectStudent called with id:', id);
    event.stopPropagation();
    setSelectedStudents(prev => {
      const selectedIndex = prev.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = [...prev, id];
      } else if (selectedIndex === 0) {
        newSelected = prev.slice(1);
      } else if (selectedIndex === prev.length - 1) {
        newSelected = prev.slice(0, -1);
      } else if (selectedIndex > 0) {
        newSelected = [
          ...prev.slice(0, selectedIndex),
          ...prev.slice(selectedIndex + 1),
        ];
      }

      return newSelected;
    });
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    console.log('📄 handleChangePage called with page:', newPage);
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    console.log('📄 handleChangeRowsPerPage called with:', event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSelectAllStudents = useCallback((event) => {
    console.log('🎯 handleSelectAllStudents called');
    if (event.target.checked) {
      const newSelecteds = getFilteredStudents.map((student) => student.id);
      setSelectedStudents(newSelecteds);
      return;
    }
    setSelectedStudents([]);
  }, [getFilteredStudents]);

  const handleStudentsDialogClose = useCallback(() => {
    console.log('❌ handleStudentsDialogClose called');
    setStudentsDialogOpen(false);
    setStudents([]);
    setStudentSearchQuery('');
    setPage(0);
    setSelectedStudents([]);
  }, []);

  const handleViewStudents = useCallback((course) => {
    console.log('👥 handleViewStudents called for course:', course?.id);
    setSelectedCourse(course);
    setStudentsLoading(true);
    setStudentsDialogOpen(true);
    
    setTimeout(() => {
      setStudents(mockStudents);
      setStudentsLoading(false);
    }, 500);
  }, [mockStudents]);

  // Thêm debug cho tất cả các handlers khác
  const handleMenuOpen = useCallback((event, course) => {
    console.log('📝 handleMenuOpen called');
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  }, []);

  const handleMenuClose = useCallback(() => {
    console.log('📝 handleMenuClose called');
    setAnchorEl(null);
    setSelectedCourse(null);
  }, []);

  const handleSemesterToggle = useCallback((semesterId) => {
    console.log('📅 handleSemesterToggle called for:', semesterId);
    setExpandedSemesters(prev => ({
      ...prev,
      [semesterId]: !prev[semesterId]
    }));
  }, []);


  const getFilteredCourses = (semesterCourses) => {
    return semesterCourses.filter(course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const isStudentSelected = useCallback((id) => selectedStudents.indexOf(id) !== -1, [selectedStudents]);


  // Status functions (same as before)
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'draft': return 'default';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'draft': return 'Bản nháp';
      case 'paused': return 'Tạm dừng';
      default: return status;
    }
  };

  const formatNextClass = (nextClassTime) => {
    if (!nextClassTime) return 'Chưa có lịch';
    const date = new Date(nextClassTime);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Memoized Course Card Component để tránh re-render không cần thiết
  const CourseCard = React.memo(({ course, isCompact = false }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      {/* Course card content remains the same */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: course.status === 'active' ? 'success.main' : 
                   course.status === 'completed' ? 'primary.main' : 
                   course.status === 'draft' ? 'grey.400' : 'warning.main'
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2.5, pt: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              {course.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip 
                label={course.code} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                label={getStatusLabel(course.status)} 
                size="small" 
                color={getStatusColor(course.status)}
              />
            </Box>
          </Box>
          {/* <IconButton 
            size="small"
            onClick={(e) => handleMenuOpen(e, course)}
          >
            <MoreVertIcon />
          </IconButton> */}
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="caption">
                {course.enrolledStudents}/{course.maxStudents} SV
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FolderIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="caption">
                {course.documents} tài liệu
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AssignmentIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption">
                {course.assignments} bài tập
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GradeIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
              <Typography variant="caption">
                ĐTB: {course.avgGrade || '--'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progress */}
        {course.status !== 'draft' && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Tiến độ học tập
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {course.completedLessons}/{course.totalLessons}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={course.progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {/* Schedule */}
        {course.schedule.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Lịch học:
            </Typography>
            {course.schedule.map((schedule, index) => (
              <Typography key={index} variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                {schedule.day}: {schedule.time} - {schedule.room}
              </Typography>
            ))}
          </Box>
        )}

        {/* Next Class */}
        {course.nextClass && (
          <Box sx={{ 
            bgcolor: 'primary.50', 
            p: 1, 
            borderRadius: 1, 
            border: '1px solid',
            borderColor: 'primary.200'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Buổi học tiếp theo:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'primary.dark' }}>
              {formatNextClass(course.nextClass)}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 0.5 }}>
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate(`/lecturer/classes/${course.id}`)}
        >
          Chi tiết
        </Button>
        <Button
          size="small"
          startIcon={<PeopleIcon />}
          onClick={() => handleViewStudents(course)}
        >
          SV
        </Button>
        <Button
          size="small"
          startIcon={<AnalyticsIcon />}
          onClick={() => navigate(`/lecturer/classes/${course.id}/analytics`)}
        >
          Thống kê
        </Button>
      </CardActions>
    </Card>
  ));

  // Memoized Semester Summary Component
  const SemesterSummary = React.memo(({ semester }) => {
    const activeCourses = semester.courses.filter(c => c.status === 'active').length;
    const completedCourses = semester.courses.filter(c => c.status === 'completed').length;
    const draftCourses = semester.courses.filter(c => c.status === 'draft').length;
    const totalStudents = semester.courses.reduce((sum, c) => sum + c.enrolledStudents, 0);

    return (
      <Grid container spacing={2} sx={{ mb: 0 }}>
        {/* <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
              {activeCourses}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Đang diễn ra
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
              {completedCourses}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hoàn thành
            </Typography>
          </Box>
        </Grid> */}
        {/* <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
              {draftCourses}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Bản nháp
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
              {totalStudents}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sinh viên
            </Typography>
          </Box>
        </Grid> */}
      </Grid>
    );
  });

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}></Typography>
        <LinearProgress />
      </Box>
    );
  }

  const semesters = getSemesters();

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ClassIcon sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Quản lý Môn học
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {}} // handleCreateCourse
          sx={{ height: 'fit-content' }}
        >
          Tạo môn học mới
        </Button>
      </Box> */}

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm môn học theo tên hoặc mã môn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Semesters */}
      <Stack spacing={3}>
        {semesters.map((semester) => {
          const filteredCourses = getFilteredCourses(semester.courses);
          const isExpanded = expandedSemesters[semester.id];
          const isCurrentSemester = semester.id === getCurrentSemester();
          
          return (
            <Paper key={semester.id} sx={{ overflow: 'hidden' }}>
              <Accordion 
                expanded={isExpanded}
                onChange={() => handleSemesterToggle(semester.id)}
                sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    bgcolor: isCurrentSemester ? 'primary.50' : 'grey.50',
                    borderLeft: isCurrentSemester ? '4px solid' : 'none',
                    borderLeftColor: 'primary.main',
                    '&:hover': { bgcolor: isCurrentSemester ? 'primary.100' : 'grey.100' }
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <CalendarIcon sx={{ color: isCurrentSemester ? 'primary.main' : 'text.secondary' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {semester.name}
                      </Typography>
                      {isCurrentSemester && (
                        <Chip 
                          label="Hiện tại" 
                          color="primary" 
                          size="small"
                        />
                      )}
                      <Chip 
                        label={`${semester.courses.length} môn học`} 
                        variant="outlined" 
                        size="small"
                      />
                    </Box>
                    
                    {isExpanded && (
                      <SemesterSummary semester={semester} />
                    )}
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 3 }}>
                  {filteredCourses.length > 0 ? (
                    <Grid container spacing={3}>
                      {filteredCourses.map((course) => (
                        <Grid item xs={12} md={6} lg={4} key={course.id}>
                          <CourseCard course={course} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <ClassIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {searchQuery ? 'Không tìm thấy môn học nào' : 'Chưa có môn học'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {searchQuery ? 'Thử từ khóa khác' : 'Tạo môn học đầu tiên cho học kỳ này'}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Paper>
          );
        })}
      </Stack>

      {/* Context Menu */}
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/lecturer/classes/${selectedCourse?.id}`)}>
          <VisibilityIcon sx={{ mr: 2 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={() => handleViewStudents(selectedCourse)}>
          <PeopleIcon sx={{ mr: 2 }} />
          Danh sách sinh viên
        </MenuItem>
        <MenuItem onClick={() => navigate(`/lecturer/classes/${selectedCourse?.id}/documents`)}>
          <FolderIcon sx={{ mr: 2 }} />
          Tài liệu
        </MenuItem>
        <MenuItem onClick={() => navigate(`/lecturer/classes/${selectedCourse?.id}/assignments`)}>
          <AssignmentIcon sx={{ mr: 2 }} />
          Bài tập
        </MenuItem>
      </Menu> */}

      {/* Students Dialog */}
      <StudentsDialog
        open={studentsDialogOpen}
        onClose={handleStudentsDialogClose}
        selectedCourse={selectedCourse}
        students={students}
        studentsLoading={studentsLoading}
      />
    </Box>
  );
};

export default CourseManagement;