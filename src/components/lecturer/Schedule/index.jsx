import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  Print,
  Download
} from '@mui/icons-material';

const TeacherSchedule = () => {
  const [selectedWeek, setSelectedWeek] = useState('Tuần 1 [từ ngày 11/08/2025 đến ngày 17/08/2025]');
  const [selectedSemester, setSemester] = useState('Học kỳ 1 - Năm học 2025-2026');

  // Dữ liệu mẫu cho lịch giảng dạy
  const scheduleData = {
    'Thứ 2': [],
    'Thứ 3': [
      {
        period: 'Tiết 9-10',
        subject: 'Phát triển các hệ thống thông minh (INT14151)',
        room: 'Nhóm: 01',
        location: 'Phòng: 501-NT-501-NT (Cơ sở Ngọc Trục)',
        instructor: 'GV: Trần Đình Quế',
        type: 'Dạy sinh viên'
      }
    ],
    'Thứ 4': [
      {
        period: 'Tiết 9-10',
        subject: 'IoT và ứng dụng (INT14149)',
        room: 'Nhóm: 02',
        location: 'Phòng: 501-NT-501-NT (Cơ sở Ngọc Trục)',
        instructor: 'GV: Lê Văn Vinh',
        type: 'Dạy sinh viên'
      }
    ],
    'Thứ 5': [
      {
        period: 'Tiết 1',
        subject: 'Quản lý dự án phần mềm (INT1450)',
        room: 'Nhóm: 03',
        location: 'Phòng: 405-NT-405 - CS Ngọc Trục',
        instructor: 'GV: Đỗ Thị Bích Ngọc',
        type: 'Dạy sinh viên'
      }
    ],
    'Thứ 6': [
      {
        period: 'Tiết 7',
        subject: 'Phương pháp luận nghiên cứu khoa học (SKD1108)',
        room: 'Nhóm: 12',
        location: 'Phòng: 501-NT-501-NT (Cơ sở Ngọc Trục)',
        instructor: 'GV: Nguyễn Thị Thu Hiền',
        type: 'Dạy sinh viên'
      }
    ],
    'Thứ 7': [],
    'Chủ Nhật': []
  };

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
    const item = daySchedule?.find(s => s.period.includes(period.split(' ')[1]));
    return item;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ mb: 3, backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ color: 'white', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            📅 THỜI KHÓA BIỂU GIẢNG DẠY
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: 'white' }}>
              <Print />
            </IconButton>
            <Button variant="contained" sx={{  }}>
              In
            </Button>
            <Button variant="contained" sx={{  }}>
              Tải lịch
            </Button>
            <Button variant="contained" sx={{ }}>
              Tải lịch
            </Button>
          </Box>
        </Toolbar>
      </Paper>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 300 }}>
          <Select
            value={selectedSemester}
            onChange={(e) => setSemester(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          >
            <MenuItem value="Học kỳ 1 - Năm học 2025-2026">Học kỳ 1 - Năm học 2025-2026</MenuItem>
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
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Box>
      </Box>

      {/* Schedule Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '80px', borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0' }}>
                Trước
              </TableCell>
              {Object.keys(scheduleData).map((day) => (
                <TableCell 
                  key={day} 
                  align="center" 
                  sx={{ color: 'white', fontWeight: 'bold', minWidth: '100px', borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0' }}
                >
                  {day}
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '80px', borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0' }}>
                Sau
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
                    textAlign: 'center'
                    , borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0'
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
                        height: '60px', 
                        verticalAlign: 'top', 
                        p: 1,
                        backgroundColor: content ? '#e3f2fd' : 'white'
                        , borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0'
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
                          <Typography variant="caption" sx={{ color: '#1976d2' }}>
                            {content.instructor}
                          </Typography>
                          <br />
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
                    textAlign: 'center'
                  }}
                >
                  {timeSlots[index]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      {/* <TableContainer component={Paper} elevation={2} sx={{ mt: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0' }}>
                Trước
              </TableCell>
              {Object.keys(scheduleData).map((day) => (
                <TableCell 
                  key={day} 
                  align="center" 
                  sx={{ color: 'white', fontWeight: 'bold', borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0' }}
                >
                  {day}
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white', fontWeight: 'bold', borderRight: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0' }}>
                Sau
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer> */}
    </Box>
  );
};

export default TeacherSchedule;