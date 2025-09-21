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
import { useNavigate, useParams } from 'react-router-dom';
import StudentsDialog from '../StudentsDialog';
import API_BASE_URL from '../../../configs/system';

const CourseManagement = () => {
  const { user, authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  console.log("refresh main");
  
  // States
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [viewMode, setViewMode] = useState('semester');
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);
  
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

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/classes/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Transform API data to match frontend structure
        const transformedCourses = data.data.map(classItem => ({
          id: classItem._id,
          name: classItem.name,
          code: classItem.courseId?.code || 'N/A',
          description: classItem.description || classItem.courseId?.description || '',
          semester: `${classItem.academicYear}.${classItem.semester}`,
          semesterName: `Học kỳ ${classItem.semester} năm ${classItem.academicYear}`,
          academicYear: classItem.academicYear,
          semesterNumber: classItem.semester,
          credits: classItem.courseId?.credits || 0,
          maxStudents: classItem.courseId?.maxStudents || 50,
          enrolledStudents: classItem.studentIds?.length || 0,
          status: classItem.status,
          lastUpdated: classItem.updatedAt,
          documents: classItem.documentIds?.length || 0,
          
          // Course details
          courseId: classItem.courseId?._id,
          courseName: classItem.courseId?.name,
          courseType: classItem.courseId?.courseType,
          
          // Schedule information
          schedule: classItem.schedule?.map(schedule => ({
            day: getDayName(schedule.dayOfWeek),
            time: `${schedule.timeStart}-${schedule.timeEnd}`,
            room: schedule.classroom
          })) || [],
          
          // Student information
          students: classItem.studentIds || [],
          
          // Derived fields (since API doesn't provide these)
          progress: 0, // Will be calculated later if needed
          assignments: 0, // Will be fetched separately if needed
          avgGrade: null, // Will be calculated later if needed
          completedLessons: 0,
          totalLessons: 0,
          nextClass: getNextClassTime(classItem.schedule)
        }));
        
        setCourses(transformedCourses);
        
        // Auto-expand current semester
        const currentSemester = getCurrentSemester();
        setExpandedSemesters({ [currentSemester]: true });
        
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  // Fetch courses from API
    const fetchCourse = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/courses/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                
                setCourse(data.data);
            } else {
                throw new Error('Failed to fetch course');
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            setError('Không thể tải môn học. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Load courses on component mount
    useEffect(() => {
        if(courseId) fetchCourse();
    }, []);

  // Helper function to get day name from day number
  const getDayName = (dayOfWeek) => {
    const days = {
      1: 'Chủ nhật',
      2: 'Thứ 2', 
      3: 'Thứ 3',
      4: 'Thứ 4',
      5: 'Thứ 5',
      6: 'Thứ 6',
      7: 'Thứ 7'
    };
    return days[dayOfWeek] || 'N/A';
  };

  // Helper function to calculate next class time
  const getNextClassTime = (schedule) => {
    if (!schedule || schedule.length === 0) return null;
    
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // Convert Sunday from 0 to 7
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    // Find next class
    for (let i = 0; i < 7; i++) {
      const checkDay = ((currentDay + i - 1) % 7) + 1;
      const todaySchedules = schedule.filter(s => s.dayOfWeek === checkDay);
      
      for (const sch of todaySchedules) {
        const classTime = parseInt(sch.timeStart.replace(':', ''));
        if (i === 0 && classTime <= currentTime) continue; // Skip past classes today
        
        const nextDate = new Date(now);
        nextDate.setDate(nextDate.getDate() + i);
        const [hours, minutes] = sch.timeStart.split(':');
        nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        return nextDate.toISOString();
      }
    }
    
    return null;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  // Helper functions
  const getCurrentSemester = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    // Assume semester 1 is Sep-Jan, semester 2 is Feb-Aug
    const semester = month >= 9 || month <= 1 ? 1 : 2;
    const academicYear = month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
    
    return `${academicYear}.${semester}`;
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

  // Students data handling
  const getFilteredStudents = useMemo(() => {
    console.log('📊 getFilteredStudents recalculated');
    return students.filter(student =>
      student.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.administrativeClass?.code.toLowerCase().includes(studentSearchQuery.toLowerCase())
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
      const newSelecteds = getFilteredStudents.map((student) => student._id);
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
    
    // Set students from course data
    setTimeout(() => {
      setStudents(course.students || []);
      setStudentsLoading(false);
    }, 500);
  }, []);

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

  // Status functions
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

  // Memoized Course Card Component
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
              <SchoolIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption">
                {course.credits} tín chỉ
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
              <Typography variant="caption">
                {course.courseType || 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Description */}
        {course.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {course.description}
          </Typography>
        )}

        {/* Schedule */}
        {course.schedule && course.schedule.length > 0 && (
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
          SV ({course.enrolledStudents})
        </Button>
        {/* <Button
          size="small"
          startIcon={<AnalyticsIcon />}
          onClick={() => navigate(`/lecturer/reports/class/${course.id}`)}
        >
          Thống kê
        </Button> */}
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
        {/* Summary stats can be shown here if needed */}
      </Grid>
    );
  });

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Đang tải dữ liệu...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Lỗi tải dữ liệu</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchCourses}
          startIcon={<ScheduleIcon />}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  const semesters = getSemesters();

  return (
    <Box sx={{ p: 2 }}>
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

      {/* Refresh Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: courseId ? 'space-between' : 'flex-end', alignItems: 'center' }}>
  {courseId && 
  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', ml: 1}}>
      Lớp học của môn {course?.name}
    </Typography>

  }
  <Button
    variant="outlined"
    startIcon={<ScheduleIcon />}
    onClick={fetchCourses}
    disabled={loading}
  >
    Làm mới
  </Button>
</Box>

      {/* Semesters */}
      {semesters.length > 0 ? (
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
                          label={`${semester.courses.length} lớp học`} 
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
                          <Grid item xs={12} md={6} lg={4} key={course.id} sx={{width: '350px'}}>
                            <CourseCard course={course} />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <ClassIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          {searchQuery ? 'Không tìm thấy lớp học nào' : 'Chưa có lớp học'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {searchQuery ? 'Thử từ khóa khác' : 'Chưa có lớp học nào trong học kỳ này'}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ClassIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            Chưa có lớp học nào
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bạn chưa được phân công giảng dạy lớp học nào
          </Typography>
          <Button
            variant="contained"
            startIcon={<ScheduleIcon />}
            onClick={fetchCourses}
          >
            Làm mới danh sách
          </Button>
        </Box>
      )}

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