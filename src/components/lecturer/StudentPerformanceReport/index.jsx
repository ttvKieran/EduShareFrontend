import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    LinearProgress,
    CircularProgress,
    IconButton,
    Tooltip,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab
} from '@mui/material';
import {
    School,
    TrendingUp,
    TrendingDown,
    Grade,
    Assignment,
    Quiz,
    Person,
    Group,
    Refresh,
    GetApp,
    FilterList,
    Visibility,
    CheckCircle,
    Cancel,
    Schedule,
    Star,
    Warning,
    EmojiEvents,
    Timeline,
    BarChart,
    Assessment,
    MenuBook,
    BookmarkBorder,
    PlayCircleOutline,
    HourglassEmpty,
    Done,
    Close,
    ErrorOutline,
    AccessTime,
    CalendarToday,
    PeopleAlt,
    ShowChart,
    PieChart as PieChartIcon,
    List as ListIcon,
    TableChart,
    Info
} from '@mui/icons-material';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    Legend, 
    ResponsiveContainer, 
    BarChart as RechartsBarChart, 
    Bar, 
    PieChart, 
    Pie, 
    Cell, 
    AreaChart, 
    Area,
    ComposedChart,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';

const StudentPerformanceReport = () => {
    // States
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedClass, setSelectedClass] = useState('all');
    const [timeRange, setTimeRange] = useState('semester');
    const [reportData, setReportData] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Mock data for student performance
    const mockData = {
        overview: {
            totalStudents: 287,
            avgGrade: 7.8,
            passRate: 85.4,
            excellentRate: 23.7,
            attendanceRate: 92.1,
            assignmentCompletionRate: 78.3
        },
        trends: {
            gradeDistribution: [
                { range: '9.0-10', count: 68, percentage: 23.7, color: '#4caf50' },
                { range: '8.0-8.9', count: 89, percentage: 31.0, color: '#8bc34a' },
                { range: '7.0-7.9', count: 73, percentage: 25.4, color: '#ffc107' },
                { range: '6.0-6.9', count: 42, percentage: 14.6, color: '#ff9800' },
                { range: '5.0-5.9', count: 12, percentage: 4.2, color: '#f44336' },
                { range: 'Dưới 5.0', count: 3, percentage: 1.1, color: '#d32f2f' }
            ],
            progressOverTime: [
                { month: 'T1', avgGrade: 6.8, passRate: 72, attendance: 88 },
                { month: 'T2', avgGrade: 7.1, passRate: 76, attendance: 90 },
                { month: 'T3', avgGrade: 7.4, passRate: 81, attendance: 91 },
                { month: 'T4', avgGrade: 7.6, passRate: 83, attendance: 92 },
                { month: 'T5', avgGrade: 7.8, passRate: 85, attendance: 92 },
                { month: 'T6', avgGrade: 7.8, passRate: 85, attendance: 92 }
            ]
        },
        courses: [
            {
                id: 1,
                name: 'Lập trình hướng đối tượng',
                code: 'IT101',
                students: 45,
                avgGrade: 8.2,
                passRate: 88.9,
                attendanceRate: 94.2,
                completionRate: 82.3
            },
            {
                id: 2,
                name: 'Cấu trúc dữ liệu và giải thuật',
                code: 'IT201',
                students: 38,
                avgGrade: 7.6,
                passRate: 84.2,
                attendanceRate: 91.5,
                completionRate: 76.8
            },
            {
                id: 3,
                name: 'Phát triển ứng dụng Web',
                code: 'IT301',
                students: 52,
                avgGrade: 8.1,
                passRate: 86.5,
                attendanceRate: 93.8,
                completionRate: 79.2
            }
        ],
        topPerformers: [
            {
                id: 1,
                name: 'Nguyễn Văn An',
                studentId: 'SV001',
                course: 'Lập trình OOP',
                grade: 9.5,
                attendance: 100,
                assignments: 95,
                improvement: 12.5
            },
            {
                id: 2,
                name: 'Trần Thị Bình',
                studentId: 'SV002',
                course: 'Phát triển Web',
                grade: 9.3,
                attendance: 98,
                assignments: 92,
                improvement: 8.7
            },
            {
                id: 3,
                name: 'Lê Minh Cường',
                studentId: 'SV003',
                course: 'Cấu trúc dữ liệu',
                grade: 9.1,
                attendance: 96,
                assignments: 90,
                improvement: 15.2
            },
            {
                id: 4,
                name: 'Phạm Thị Dung',
                studentId: 'SV004',
                course: 'Lập trình OOP',
                grade: 8.9,
                attendance: 100,
                assignments: 88,
                improvement: 6.3
            },
            {
                id: 5,
                name: 'Hoàng Văn Em',
                studentId: 'SV005',
                course: 'Phát triển Web',
                grade: 8.8,
                attendance: 94,
                assignments: 85,
                improvement: 10.8
            }
        ],
        strugglingStudents: [
            {
                id: 1,
                name: 'Nguyễn Thị Linh',
                studentId: 'SV045',
                course: 'Cấu trúc dữ liệu',
                grade: 4.2,
                attendance: 65,
                assignments: 45,
                issues: ['Vắng học nhiều', 'Không nộp bài tập'],
                improvement: -5.2
            },
            {
                id: 2,
                name: 'Trần Văn Huy',
                studentId: 'SV032',
                course: 'Lập trình OOP',
                grade: 4.8,
                attendance: 72,
                assignments: 55,
                issues: ['Thiếu kiến thức nền', 'Ít tham gia thảo luận'],
                improvement: -2.1
            },
            {
                id: 3,
                name: 'Lê Thị Mai',
                studentId: 'SV028',
                course: 'Phát triển Web',
                grade: 5.1,
                attendance: 78,
                assignments: 62,
                issues: ['Khó khăn với thực hành'],
                improvement: 1.3
            }
        ],
        assignments: {
            completion: [
                { assignment: 'Bài tập 1: Cơ bản OOP', submitted: 42, total: 45, rate: 93.3, avgGrade: 8.5 },
                { assignment: 'Bài tập 2: Inheritance', submitted: 38, total: 45, rate: 84.4, avgGrade: 7.8 },
                { assignment: 'Bài tập 3: Polymorphism', submitted: 40, total: 45, rate: 88.9, avgGrade: 8.1 },
                { assignment: 'Project giữa kỳ', submitted: 35, total: 45, rate: 77.8, avgGrade: 7.2 },
                { assignment: 'Bài tập 4: Exception', submitted: 41, total: 45, rate: 91.1, avgGrade: 8.3 }
            ]
        },
        engagement: {
            participation: [
                { activity: 'Tham gia lớp học', rate: 92.1, color: '#4caf50' },
                { activity: 'Thảo luận trực tuyến', rate: 68.5, color: '#2196f3' },
                { activity: 'Nộp bài đúng hạn', rate: 78.3, color: '#ff9800' },
                { activity: 'Truy cập tài liệu', rate: 85.7, color: '#9c27b0' },
                { activity: 'Xem video bài giảng', rate: 73.2, color: '#607d8b' }
            ]
        },
        attendance: {
            byClass: [
                { class: 'IT101-K18A', students: 45, present: 42, absent: 3, rate: 93.3 },
                { class: 'IT201-K18B', students: 38, present: 35, absent: 3, rate: 92.1 },
                { class: 'IT301-K18C', students: 52, present: 47, absent: 5, rate: 90.4 }
            ],
            trend: [
                { week: 'T1', rate: 88.2 },
                { week: 'T2', rate: 90.5 },
                { week: 'T3', rate: 91.8 },
                { week: 'T4', rate: 92.1 },
                { week: 'T5', rate: 91.5 },
                { week: 'T6', rate: 92.3 }
            ]
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [selectedCourse, selectedClass, timeRange]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setReportData(mockData);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setDialogOpen(true);
    };

    const getGradeColor = (grade) => {
        if (grade >= 9) return '#4caf50';
        if (grade >= 8) return '#8bc34a';
        if (grade >= 7) return '#ffc107';
        if (grade >= 6) return '#ff9800';
        if (grade >= 5) return '#f44336';
        return '#d32f2f';
    };

    const getAttendanceColor = (rate) => {
        if (rate >= 95) return '#4caf50';
        if (rate >= 85) return '#8bc34a';
        if (rate >= 75) return '#ffc107';
        if (rate >= 65) return '#ff9800';
        return '#f44336';
    };

    const StatCard = ({ icon, title, value, subtitle, trend, color = 'primary', gradientColors = ['#667eea', '#764ba2'] }) => (
        <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`, 
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                    {trend && (
                        <Chip
                            icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
                            label={`${trend > 0 ? '+' : ''}${trend}%`}
                            size="small"
                            sx={{
                                color: trend > 0 ? '#4caf50' : '#f44336',
                                fontWeight: 600,
                                backgroundColor: 'white'
                            }}
                        />
                    )}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {value}
                </Typography>
                <Typography variant="h6" sx={{ mb: 0.5, opacity: 0.9, fontWeight: 600 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Đang tải báo cáo học tập...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                            📚 Báo cáo Học tập
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Theo dõi tiến độ và kết quả học tập của sinh viên
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Môn học</InputLabel>
                            <Select
                                value={selectedCourse}
                                label="Môn học"
                                onChange={handleCourseChange}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="it101">Lập trình OOP</MenuItem>
                                <MenuItem value="it201">Cấu trúc dữ liệu</MenuItem>
                                <MenuItem value="it301">Phát triển Web</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Lớp học</InputLabel>
                            <Select
                                value={selectedClass}
                                label="Lớp học"
                                onChange={handleClassChange}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="k18a">K18A</MenuItem>
                                <MenuItem value="k18b">K18B</MenuItem>
                                <MenuItem value="k18c">K18C</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Thời gian</InputLabel>
                            <Select
                                value={timeRange}
                                label="Thời gian"
                                onChange={handleTimeRangeChange}
                            >
                                <MenuItem value="month">Tháng này</MenuItem>
                                <MenuItem value="semester">Học kỳ này</MenuItem>
                                <MenuItem value="year">Năm học này</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchReportData}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Làm mới
                        </Button>
                        
                        <Button
                            variant="contained"
                            startIcon={<GetApp />}
                            sx={{ 
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Xuất báo cáo
                        </Button>
                    </Box>
                </Box>

                {/* Overview Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2} sx={{ width: '16.66%' }}>
                        <StatCard
                            icon={<PeopleAlt />}
                            title="Sinh viên"
                            value={reportData?.overview.totalStudents || 0}
                            subtitle="Tổng số học viên"
                            trend={5.2}
                            gradientColors={['#667eea', '#764ba2']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} sx={{ width: '16.66%' }}>
                        <StatCard
                            icon={<Grade />}
                            title="Điểm TB"
                            value={reportData?.overview.avgGrade || 0}
                            subtitle="Điểm trung bình chung"
                            trend={3.1}
                            gradientColors={['#f093fb', '#f5576c']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} sx={{ width: '16.66%' }}>
                        <StatCard
                            icon={<CheckCircle />}
                            title="Tỷ lệ đậu"
                            value={`${reportData?.overview.passRate}%` || '0%'}
                            subtitle="Sinh viên đạt yêu cầu"
                            trend={2.8}
                            gradientColors={['#4facfe', '#00f2fe']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} sx={{ width: '16.66%' }}>
                        <StatCard
                            icon={<EmojiEvents />}
                            title="Xuất sắc"
                            value={`${reportData?.overview.excellentRate}%` || '0%'}
                            subtitle="Sinh viên điểm cao"
                            trend={4.5}
                            gradientColors={['#43e97b', '#38f9d7']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} sx={{ width: '16.66%' }}>
                        <StatCard
                            icon={<Schedule />}
                            title="Chuyên cần"
                            value={`${reportData?.overview.attendanceRate}%` || '0%'}
                            subtitle="Tỷ lệ tham gia lớp"
                            trend={1.2}
                            gradientColors={['#fa709a', '#fee140']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} sx={{ width: '16.66%' }}>
                        <StatCard
                            icon={<Assignment />}
                            title="Hoàn thành BT"
                            value={`${reportData?.overview.assignmentCompletionRate}%` || '0%'}
                            subtitle="Tỷ lệ nộp bài tập"
                            trend={-1.8}
                            gradientColors={['#a8edea', '#fed6e3']}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Main Content Tabs */}
            <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
                <Tabs 
                    value={selectedTab} 
                    onChange={handleTabChange} 
                    sx={{ borderBottom: '1px solid #e0e0e0' }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<BarChart />} label="Phân bố điểm" />
                    <Tab icon={<Timeline />} label="Xu hướng học tập" />
                    <Tab icon={<EmojiEvents />} label="Học sinh giỏi" />
                    <Tab icon={<Warning />} label="Học sinh yếu" />
                    <Tab icon={<Assignment />} label="Bài tập" />
                    <Tab icon={<PieChartIcon />} label="Mức độ tham gia" />
                </Tabs>

                <CardContent sx={{ p: 4 }}>
                    {/* Tab 0: Grade Distribution */}
                    {selectedTab === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Phân bố điểm số
                                </Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RechartsBarChart data={reportData?.trends.gradeDistribution || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="range" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <RechartsTooltip 
                                            formatter={(value, name) => [value, name === 'count' ? 'Số sinh viên' : name]}
                                        />
                                        <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Thống kê chi tiết
                                </Typography>
                                {reportData?.trends.gradeDistribution.map((item, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {item.range}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {item.count} SV ({item.percentage}%)
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.percentage}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: '#f0f0f0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: item.color
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    )}

                    {/* Tab 1: Progress Trends */}
                    {selectedTab === 1 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Xu hướng tiến bộ theo thời gian
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={reportData?.trends.progressOverTime || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#666" />
                                    <YAxis yAxisId="left" stroke="#666" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#666" />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Area yAxisId="right" type="monotone" dataKey="attendance" fill="#e3f2fd" stroke="#2196f3" fillOpacity={0.6} name="Tỷ lệ tham gia (%)" />
                                    <Bar yAxisId="right" dataKey="passRate" fill="#4caf50" name="Tỷ lệ đậu (%)" />
                                    <Line yAxisId="left" type="monotone" dataKey="avgGrade" stroke="#ff7300" strokeWidth={3} name="Điểm TB" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Box>
                    )}

                    {/* Tab 2: Top Performers */}
                    {selectedTab === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Top 5 học sinh xuất sắc
                            </Typography>
                            <Grid container spacing={2}>
                                {reportData?.topPerformers.map((student, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{ 
                                            border: index === 0 ? '2px solid #ffd700' : '1px solid #e0e0e0',
                                            boxShadow: index === 0 ? '0 6px 20px rgba(255,215,0,0.3)' : 2,
                                            borderRadius: 2,
                                            position: 'relative',
                                            '&:hover': { boxShadow: 4 }
                                        }}>
                                            {index === 0 && (
                                                <Chip
                                                    icon={<EmojiEvents />}
                                                    label="TOP 1"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: 8,
                                                        bgcolor: '#ffd700',
                                                        color: '#333',
                                                        fontWeight: 600,
                                                        zIndex: 1
                                                    }}
                                                />
                                            )}
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: getGradeColor(student.grade), 
                                                        width: 48, 
                                                        height: 48,
                                                        mr: 2
                                                    }}>
                                                        #{index + 1}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {student.studentId} • {student.course}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" sx={{ 
                                                                fontWeight: 700, 
                                                                color: getGradeColor(student.grade)
                                                            }}>
                                                                {student.grade}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Điểm TB
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" sx={{ 
                                                                fontWeight: 700, 
                                                                color: getAttendanceColor(student.attendance)
                                                            }}>
                                                                {student.attendance}%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Chuyên cần
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Box sx={{ mt: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2">Bài tập</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {student.assignments}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={student.assignments}
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>

                                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Chip
                                                        icon={<TrendingUp />}
                                                        label={`+${student.improvement}%`}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                    />
                                                    <Button
                                                        size="small"
                                                        startIcon={<Visibility />}
                                                        onClick={() => handleViewStudent(student)}
                                                    >
                                                        Chi tiết
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 3: Struggling Students */}
                    {selectedTab === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Học sinh cần hỗ trợ
                            </Typography>
                            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                                <Typography variant="body2">
                                    Danh sách các sinh viên có kết quả học tập thấp hoặc gặp khó khăn trong việc học.
                                    Cần có biện pháp hỗ trợ phù hợp.
                                </Typography>
                            </Alert>
                            
                            {reportData?.strugglingStudents.map((student, index) => (
                                <Card key={index} sx={{ mb: 2, border: '1px solid #ffeb3b', borderRadius: 2 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Grid container spacing={3} alignItems="center">
                                            <Grid item xs={12} md={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: getGradeColor(student.grade), 
                                                        mr: 2,
                                                        width: 48,
                                                        height: 48
                                                    }}>
                                                        <Warning />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {student.studentId} • {student.course}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={2}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h5" sx={{ 
                                                        fontWeight: 700, 
                                                        color: getGradeColor(student.grade)
                                                    }}>
                                                        {student.grade}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Điểm TB
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={2}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h5" sx={{ 
                                                        fontWeight: 700, 
                                                        color: getAttendanceColor(student.attendance)
                                                    }}>
                                                        {student.attendance}%
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Chuyên cần
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                                    Vấn đề gặp phải:
                                                </Typography>
                                                {student.issues.map((issue, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={issue}
                                                        size="small"
                                                        color="warning"
                                                        variant="outlined"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ))}
                                            </Grid>
                                            
                                            <Grid item xs={12} md={2}>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    startIcon={<Person />}
                                                    fullWidth
                                                    onClick={() => handleViewStudent(student)}
                                                >
                                                    Hỗ trợ
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}

                    {/* Tab 4: Assignment Completion */}
                    {selectedTab === 4 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Tình hình hoàn thành bài tập
                            </Typography>
                            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell><strong>Bài tập</strong></TableCell>
                                            <TableCell align="center"><strong>Đã nộp</strong></TableCell>
                                            <TableCell align="center"><strong>Tổng số</strong></TableCell>
                                            <TableCell align="center"><strong>Tỷ lệ</strong></TableCell>
                                            <TableCell align="center"><strong>Điểm TB</strong></TableCell>
                                            <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reportData?.assignments.completion.map((assignment, index) => (
                                            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {assignment.assignment}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                                        {assignment.submitted}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {assignment.total}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={`${assignment.rate}%`}
                                                        size="small"
                                                        color={assignment.rate >= 90 ? 'success' : assignment.rate >= 75 ? 'warning' : 'error'}
                                                        variant="filled"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 600, 
                                                        color: getGradeColor(assignment.avgGrade) 
                                                    }}>
                                                        {assignment.avgGrade}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {assignment.rate >= 90 ? (
                                                        <CheckCircle color="success" />
                                                    ) : assignment.rate >= 75 ? (
                                                        <HourglassEmpty color="warning" />
                                                    ) : (
                                                        <ErrorOutline color="error" />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Tab 5: Engagement */}
                    {selectedTab === 5 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Mức độ tham gia các hoạt động
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <RadarChart data={reportData?.engagement.participation || []}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="activity" />
                                        <PolarRadiusAxis angle={0} domain={[0, 100]} />
                                        <Radar
                                            name="Tỷ lệ tham gia"
                                            dataKey="rate"
                                            stroke="#1976d2"
                                            fill="#1976d2"
                                            fillOpacity={0.3}
                                            strokeWidth={2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Chi tiết tham gia
                                </Typography>
                                {reportData?.engagement.participation.map((item, index) => (
                                    <Box key={index} sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {item.activity}
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {item.rate}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.rate}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                bgcolor: '#f0f0f0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: item.color,
                                                    borderRadius: 5
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Course Performance Summary */}
            <Grid container spacing={3}>
                {/* Course Performance Cards */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Hiệu suất theo môn học"
                            subheader="So sánh kết quả giữa các môn học"
                            avatar={<MenuBook color="primary" />}
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                {reportData?.courses.map((course, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Card sx={{ 
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            '&:hover': { boxShadow: 4 }
                                        }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {course.name}
                                                </Typography>
                                                <Chip 
                                                    label={course.code} 
                                                    size="small" 
                                                    color="primary" 
                                                    variant="outlined" 
                                                    sx={{ mb: 2 }}
                                                />
                                                
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                        Số sinh viên: <strong>{course.students}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Điểm TB: <strong style={{ color: getGradeColor(course.avgGrade) }}>
                                                            {course.avgGrade}
                                                        </strong>
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tỷ lệ đậu: {course.passRate}%
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={course.passRate}
                                                        sx={{ height: 6, borderRadius: 3, mb: 1 }}
                                                    />
                                                </Box>

                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Chuyên cần: {course.attendanceRate}%
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={course.attendanceRate}
                                                        color="success"
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Attendance Trend */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Xu hướng chuyên cần"
                            subheader="Tỷ lệ tham gia theo tuần"
                            avatar={<Schedule color="success" />}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={reportData?.attendance.trend || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="week" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <RechartsTooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="rate" 
                                        stroke="#4caf50" 
                                        fill="#4caf50" 
                                        fillOpacity={0.6} 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Student Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Person />
                        </Avatar>
                        <Box>
                            <Typography variant="h6">
                                Chi tiết học sinh: {selectedStudent?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedStudent?.studentId} • {selectedStudent?.course}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Điểm trung bình
                                </Typography>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    color: getGradeColor(selectedStudent.grade),
                                    mb: 2
                                }}>
                                    {selectedStudent.grade}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Tỷ lệ chuyên cần
                                </Typography>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    color: getAttendanceColor(selectedStudent.attendance),
                                    mb: 2
                                }}>
                                    {selectedStudent.attendance}%
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Hoàn thành bài tập
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Tiến độ</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {selectedStudent.assignments}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={selectedStudent.assignments}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                            </Grid>
                            {selectedStudent.issues && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                        Vấn đề cần quan tâm
                                    </Typography>
                                    {selectedStudent.issues.map((issue, idx) => (
                                        <Chip
                                            key={idx}
                                            label={issue}
                                            color="warning"
                                            variant="outlined"
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Đóng
                    </Button>
                    <Button variant="contained">
                        Gửi thông báo
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentPerformanceReport;