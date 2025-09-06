import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Toolbar,
  Button,
  Alert,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  Print,
  Download,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import API_BASE_URL from '../../../configs/system';

const TeacherSchedule = () => {
  const { authenticatedFetch } = useAuth();
  
  // States
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState('Tuần 1 [từ ngày 11/08/2025 đến ngày 17/08/2025]');
  const [selectedSemester, setSelectedSemester] = useState('Học kỳ 1 - Năm học 2025-2026');

  // Fetch schedule data from API
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/classes/schedule`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Schedule API Response:', data);
        
        if (data.success) {
          setClasses(data.data);
        } else {
          setError('Không thể tải dữ liệu lịch giảng dạy');
        }
      } else {
        setError('Lỗi khi tải lịch giảng dạy');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchScheduleData();
  }, []);

  // Helper function to convert dayOfWeek number to Vietnamese day name
  const getDayName = (dayOfWeek) => {
    const days = {
      1: 'Chủ Nhật',
      2: 'Thứ 2', 
      3: 'Thứ 3',
      4: 'Thứ 4',
      5: 'Thứ 5',
      6: 'Thứ 6',
      7: 'Thứ 7'
    };
    return days[dayOfWeek] || '';
  };

  // Helper function to get period from time
  const getPeriodFromTime = (timeStart) => {
    const timeToSlot = {
      '07:00': 'Tiết 1',
      '08:00': 'Tiết 3', 
      '09:00': 'Tiết 5',
      '10:00': 'Tiết 7',
      '13:00': 'Tiết 7',
      '14:00': 'Tiết 9',
      '15:00': 'Tiết 11',
      '16:00': 'Tiết 13'
    };
    return timeToSlot[timeStart] || timeStart;
  };

  // Transform API data to schedule format
  const transformToScheduleData = () => {
    const scheduleData = {
      'Thứ 2': [],
      'Thứ 3': [],
      'Thứ 4': [],
      'Thứ 5': [],
      'Thứ 6': [],
      'Thứ 7': [],
      'Chủ Nhật': []
    };

    classes.forEach(classItem => {
      if (classItem.schedule && classItem.schedule.length > 0) {
        classItem.schedule.forEach(scheduleItem => {
          const dayName = getDayName(scheduleItem.dayOfWeek);
          if (dayName && scheduleData[dayName]) {
            const scheduleEntry = {
              period: `${getPeriodFromTime(scheduleItem.timeStart)} (${scheduleItem.timeStart}-${scheduleItem.timeEnd})`,
              subject: `${classItem.courseId.name} (${classItem.courseId.code})`,
              room: `Lớp: ${classItem.name}`,
              location: `Phòng: ${scheduleItem.classroom}`,
              instructor: `Giảng viên đang giảng dạy`,
              type: 'Dạy sinh viên',
              classId: classItem._id,
              courseId: classItem.courseId._id,
              credits: classItem.courseId.credits,
              studentCount: classItem.studentIds ? classItem.studentIds.length : 0,
              maxStudents: classItem.courseId.maxStudents
            };
            scheduleData[dayName].push(scheduleEntry);
          }
        });
      }
    });

    return scheduleData;
  };

  const scheduleData = transformToScheduleData();

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
    '19:00', '20:00', '21:00'
  ];

  const periods = [
    'Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5', 'Tiết 6',
    'Tiết 7', 'Tiết 8', 'Tiết 9', 'Tiết 10', 'Tiết 11', 'Tiết 12',
    'Tiết 13', 'Tiết 14', 'Tiết 15'
  ];

  const getCellContent = (day, period) => {
    const daySchedule = scheduleData[day];
    return daySchedule?.find(s => s.period.includes(period)) || null;
  };

  // Get unique semesters from classes data
  const getSemesters = () => {
    const semesters = [...new Set(classes.map(c => `Học kỳ ${c.semester} - Năm học ${c.academicYear}`))];
    return semesters.length > 0 ? semesters : ['Học kỳ 1 - Năm học 2025-2026'];
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <Paper elevation={2} sx={{ mb: 3, backgroundColor: '#1976d2' }}>
          <Toolbar sx={{ color: 'white', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              📅 THỜI KHÓA BIỂU GIẢNG DẠY
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CircularProgress size={24} sx={{ color: 'white' }} />
            </Box>
          </Toolbar>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={300} height={56} />
          <Skeleton variant="rectangular" width={400} height={56} />
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Skeleton variant="rectangular" width="100%" height={600} />
        </TableContainer>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchScheduleData}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ color: 'white', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            📅 THỜI KHÓA BIỂU GIẢNG DẠY
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: 'white' }} onClick={fetchScheduleData}>
              <Refresh />
            </IconButton>
            <Button variant="contained" startIcon={<Print />}>
              In
            </Button>
            <Button variant="contained" startIcon={<Download />}>
              Tải lịch
            </Button>
          </Box>
        </Toolbar>
      </Paper>

      {/* Summary Stats */}
      {/* <Paper sx={{ p: 2, mb: 3, backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
              {classes.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tổng lớp học
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
              {classes.filter(c => c.status === 'active').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Lớp đang hoạt động
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
              {classes.reduce((total, c) => total + (c.studentIds ? c.studentIds.length : 0), 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tổng sinh viên
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 600 }}>
              {classes.reduce((total, c) => total + (c.schedule ? c.schedule.length : 0), 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tiết học/tuần
            </Typography>
          </Box>
        </Box>
      </Paper> */}

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 300 }}>
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          >
            {getSemesters().map((semester) => (
              <MenuItem key={semester} value={semester}>
                {semester}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 400 }}>
          <Select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          >
            <MenuItem value="Tuần 1 [từ ngày 11/08/2025 đến ngày 17/08/2025]">
              Tuần 1 [từ ngày 11/08/2025 đến ngày 17/08/2025]
            </MenuItem>
            <MenuItem value="Tuần 2 [từ ngày 18/08/2025 đến ngày 24/08/2025]">
              Tuần 2 [từ ngày 18/08/2025 đến ngày 24/08/2025]
            </MenuItem>
          </Select>
        </FormControl>

        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#1976d2' }}>
            <NavigateBefore />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>Trước</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mx: 1 }}>Sau</Typography>
          <IconButton sx={{ color: '#1976d2' }}>
            <NavigateNext />
          </IconButton>
        </Box> */}
      </Box>

      {/* Schedule Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                width: '80px', 
                borderRight: '1px solid #E0E0E0', 
                borderLeft: '1px solid #E0E0E0' 
              }}>
                Tiết
              </TableCell>
              {Object.keys(scheduleData).map((day) => (
                <TableCell 
                  key={day} 
                  align="center" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    minWidth: '150px', 
                    borderRight: '1px solid #E0E0E0', 
                    borderLeft: '1px solid #E0E0E0' 
                  }}
                >
                  {day}
                </TableCell>
              ))}
              <TableCell sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                width: '80px', 
                borderRight: '1px solid #E0E0E0', 
                borderLeft: '1px solid #E0E0E0' 
              }}>
                Giờ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periods.map((period, index) => (
              <TableRow key={period}>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#1976d2', 
                    color: 'white', 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderRight: '1px solid #E0E0E0', 
                    borderLeft: '1px solid #E0E0E0'
                  }}
                >
                  {period}
                </TableCell>
                {Object.keys(scheduleData).map((day) => {
                  const content = getCellContent(day, period);
                  return (
                    <TableCell 
                      key={day} 
                      sx={{ 
                        height: '80px', 
                        verticalAlign: 'top', 
                        p: 1,
                        backgroundColor: content ? '#e3f2fd' : 'white',
                        borderRight: '1px solid #E0E0E0', 
                        borderLeft: '1px solid #E0E0E0'
                      }}
                    >
                      {content && (
                        <Box sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                            {content.subject}
                          </Typography>
                          <br />
                          <Typography variant="caption" sx={{ color: '#1976d2' }}>
                            {content.room}
                          </Typography>
                          <br />
                          <Typography variant="caption" sx={{ color: '#1976d2' }}>
                            {content.location}
                          </Typography>
                          <br />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            SV: {content.studentCount}/{content.maxStudents}
                          </Typography>
                          <br />
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                            <Chip 
                              label={content.type} 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#bbdefb', 
                                color: '#1565c0',
                                fontSize: '0.6rem',
                                height: '16px'
                              }} 
                            />
                            <Chip 
                              label={`${content.credits} TC`} 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#c8e6c9', 
                                color: '#2e7d32',
                                fontSize: '0.6rem',
                                height: '16px'
                              }} 
                            />
                          </Box>
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell 
                  sx={{ 
                    backgroundColor: '#1976d2', 
                    color: 'white', 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderRight: '1px solid #E0E0E0', 
                    borderLeft: '1px solid #E0E0E0'
                  }}
                >
                  {timeSlots[index]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* No schedule message */}
      {classes.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Chưa có lịch giảng dạy nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Bạn chưa được phân công giảng dạy lớp học nào trong học kỳ này
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchScheduleData}
          >
            Làm mới
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default TeacherSchedule;