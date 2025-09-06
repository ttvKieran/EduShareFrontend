import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Breadcrumbs,
    Link
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
    Info,
    Class,
    Code,
    ArrowBack,
    ExpandMore,
    VideoLibrary,
    Assignment as AssignmentIcon,
    QuestionAnswer,
    Forum,
    Announcement,
    Download,
    Upload,
    Feedback,
    Analytics,
    TrendingFlat,
    CompareArrows
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
    Radar,
    ScatterChart,
    Scatter
} from 'recharts';

const CourseReport = () => {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('current');
    const [selectedClass, setSelectedClass] = useState('all');
    const [reportData, setReportData] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Mock data cho báo cáo môn học
    const mockData = {
        courseInfo: {
            id: 'IT301',
            name: 'Phát triển ứng dụng Web',
            code: 'IT301',
            credits: 3,
            semester: 'HK1 2024-2025',
            totalClasses: 4,
            totalStudents: 156,
            instructor: 'TS. Nguyễn Văn A',
            startDate: '2024-09-01',
            endDate: '2024-12-20'
        },
        overview: {
            totalStudents: 156,
            avgGrade: 7.6,
            passRate: 84.6,
            excellentRate: 19.2,
            goodRate: 38.5,
            averageRate: 26.9,
            belowAverageRate: 15.4,
            attendanceRate: 89.7,
            assignmentCompletionRate: 81.4,
            examPassRate: 87.2
        },
        classes: [
            {
                id: 'IT301-K19A',
                name: 'K19A',
                students: 42,
                avgGrade: 7.8,
                passRate: 88.1,
                attendanceRate: 92.3,
                completionRate: 85.7,
                excellentCount: 9,
                goodCount: 18,
                averageCount: 10,
                belowAverageCount: 5
            },
            {
                id: 'IT301-K19B',
                name: 'K19B',
                students: 38,
                avgGrade: 7.5,
                passRate: 84.2,
                attendanceRate: 88.9,
                completionRate: 78.9,
                excellentCount: 7,
                goodCount: 14,
                averageCount: 11,
                belowAverageCount: 6
            },
            {
                id: 'IT301-K19C',
                name: 'K19C',
                students: 40,
                avgGrade: 7.4,
                passRate: 82.5,
                attendanceRate: 87.5,
                completionRate: 80.0,
                excellentCount: 6,
                goodCount: 15,
                averageCount: 13,
                belowAverageCount: 6
            },
            {
                id: 'IT301-K18D',
                name: 'K18D (Học lại)',
                students: 36,
                avgGrade: 7.7,
                passRate: 83.3,
                attendanceRate: 91.7,
                completionRate: 80.6,
                excellentCount: 8,
                goodCount: 13,
                averageCount: 8,
                belowAverageCount: 7
            }
        ],
        progressOverTime: [
            { week: 'T1', avgGrade: 0, passRate: 0, attendance: 95, completion: 0 },
            { week: 'T2', avgGrade: 6.2, passRate: 65, attendance: 93, completion: 45 },
            { week: 'T3', avgGrade: 6.8, passRate: 72, attendance: 91, completion: 58 },
            { week: 'T4', avgGrade: 7.1, passRate: 76, attendance: 90, completion: 67 },
            { week: 'T5', avgGrade: 7.3, passRate: 79, attendance: 89, completion: 73 },
            { week: 'T6', avgGrade: 7.4, passRate: 81, attendance: 88, completion: 76 },
            { week: 'T7', avgGrade: 7.5, passRate: 82, attendance: 89, completion: 78 },
            { week: 'T8', avgGrade: 7.5, passRate: 83, attendance: 90, completion: 79 },
            { week: 'T9', avgGrade: 7.6, passRate: 84, attendance: 89, completion: 80 },
            { week: 'T10', avgGrade: 7.6, passRate: 85, attendance: 90, completion: 81 }
        ],
        gradeDistribution: [
            { range: '9.0-10', count: 30, percentage: 19.2, color: '#4caf50' },
            { range: '8.0-8.9', count: 60, percentage: 38.5, color: '#8bc34a' },
            { range: '7.0-7.9', count: 42, percentage: 26.9, color: '#ffc107' },
            { range: '6.0-6.9', count: 16, percentage: 10.3, color: '#ff9800' },
            { range: '5.0-5.9', count: 6, percentage: 3.8, color: '#f44336' },
            { range: 'Dưới 5.0', count: 2, percentage: 1.3, color: '#d32f2f' }
        ],
        assignments: [
            {
                id: 1,
                name: 'Bài tập 1: HTML/CSS Cơ bản',
                type: 'Bài tập',
                dueDate: '2024-09-15',
                submitted: 142,
                total: 156,
                avgGrade: 8.2,
                maxGrade: 9.8,
                minGrade: 4.5,
                onTime: 138,
                late: 4
            },
            {
                id: 2,
                name: 'Bài tập 2: JavaScript DOM',
                type: 'Bài tập',
                dueDate: '2024-09-30',
                submitted: 135,
                total: 156,
                avgGrade: 7.8,
                maxGrade: 9.5,
                minGrade: 3.2,
                onTime: 129,
                late: 6
            },
            {
                id: 3,
                name: 'Project Giữa kỳ: Website Cá nhân',
                type: 'Dự án',
                dueDate: '2024-10-20',
                submitted: 128,
                total: 156,
                avgGrade: 7.4,
                maxGrade: 9.2,
                minGrade: 5.0,
                onTime: 121,
                late: 7
            },
            {
                id: 4,
                name: 'Kiểm tra Giữa kỳ',
                type: 'Kiểm tra',
                dueDate: '2024-10-25',
                submitted: 150,
                total: 156,
                avgGrade: 7.1,
                maxGrade: 9.0,
                minGrade: 2.8,
                onTime: 150,
                late: 0
            },
            {
                id: 5,
                name: 'Bài tập 3: React Components',
                type: 'Bài tập',
                dueDate: '2024-11-15',
                submitted: 140,
                total: 156,
                avgGrade: 7.6,
                maxGrade: 9.4,
                minGrade: 4.1,
                onTime: 132,
                late: 8
            }
        ],
        topPerformers: [
            {
                id: 1,
                name: 'Nguyễn Thị Mai',
                studentId: 'SV19001',
                class: 'K19A',
                grade: 9.4,
                attendance: 98,
                assignments: 96,
                improvement: 15.2,
                ranking: 1
            },
            {
                id: 2,
                name: 'Trần Văn Hùng',
                studentId: 'SV19002',
                class: 'K19B',
                grade: 9.2,
                attendance: 95,
                assignments: 94,
                improvement: 12.8,
                ranking: 2
            },
            {
                id: 3,
                name: 'Lê Thị Lan',
                studentId: 'SV19003',
                class: 'K19A',
                grade: 9.0,
                attendance: 100,
                assignments: 92,
                improvement: 18.6,
                ranking: 3
            }
        ],
        strugglingStudents: [
            {
                id: 1,
                name: 'Phạm Văn Nam',
                studentId: 'SV19045',
                class: 'K19C',
                grade: 4.2,
                attendance: 68,
                assignments: 45,
                issues: ['Vắng học nhiều', 'Không nộp bài tập', 'Yếu kiến thức nền'],
                lastSubmission: '2024-09-20'
            },
            {
                id: 2,
                name: 'Hoàng Thị Linh',
                studentId: 'SV19032',
                class: 'K19B',
                grade: 4.8,
                attendance: 72,
                assignments: 55,
                issues: ['Khó khăn với lập trình', 'Ít tham gia thảo luận'],
                lastSubmission: '2024-10-05'
            }
        ],
        engagement: {
            activities: [
                { activity: 'Tham gia lớp học', rate: 89.7, color: '#4caf50' },
                { activity: 'Thảo luận trực tuyến', rate: 67.3, color: '#2196f3' },
                { activity: 'Nộp bài đúng hạn', rate: 81.4, color: '#ff9800' },
                { activity: 'Truy cập tài liệu', rate: 92.8, color: '#9c27b0' },
                { activity: 'Xem video bài giảng', rate: 74.4, color: '#607d8b' },
                { activity: 'Làm bài quiz', rate: 78.8, color: '#795548' }
            ],
            resourceUsage: [
                { resource: 'Slide bài giảng', views: 2847, downloads: 1456 },
                { resource: 'Video bài giảng', views: 1923, duration: '2h 45m' },
                { resource: 'Tài liệu tham khảo', views: 1234, downloads: 892 },
                { resource: 'Code examples', views: 2156, downloads: 1678 },
                { resource: 'Bài tập mẫu', views: 1845, downloads: 1234 }
            ]
        },
        skills: {
            assessment: [
                { skill: 'HTML/CSS', avgScore: 8.2, maxScore: 10, students: 156 },
                { skill: 'JavaScript', avgScore: 7.4, maxScore: 10, students: 156 },
                { skill: 'React', avgScore: 6.8, maxScore: 10, students: 140 },
                { skill: 'Node.js', avgScore: 6.2, maxScore: 10, students: 128 },
                { skill: 'Database', avgScore: 7.1, maxScore: 10, students: 135 },
                { skill: 'Git/GitHub', avgScore: 7.6, maxScore: 10, students: 152 }
            ]
        },
        comparison: {
            previousSemesters: [
                { semester: 'HK2 2023-2024', avgGrade: 7.2, passRate: 82.1, students: 148 },
                { semester: 'HK1 2023-2024', avgGrade: 7.0, passRate: 79.5, students: 142 },
                { semester: 'HK3 2022-2023', avgGrade: 6.8, passRate: 76.8, students: 138 }
            ],
            otherCourses: [
                { course: 'Lập trình OOP', avgGrade: 7.8, passRate: 86.2 },
                { course: 'Cấu trúc dữ liệu', avgGrade: 7.1, passRate: 81.4 },
                { course: 'Cơ sở dữ liệu', avgGrade: 7.4, passRate: 83.7 }
            ]
        }
    };

    useEffect(() => {
        fetchCourseReportData();
    }, [courseId, selectedSemester, selectedClass]);

    const fetchCourseReportData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setReportData(mockData);
        } catch (error) {
            console.error('Error fetching course report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSemesterChange = (event) => {
        setSelectedSemester(event.target.value);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const getGradeColor = (grade) => {
        if (grade >= 9) return '#4caf50';
        if (grade >= 8) return '#8bc34a';
        if (grade >= 7) return '#ffc107';
        if (grade >= 6) return '#ff9800';
        if (grade >= 5) return '#f44336';
        return '#d32f2f';
    };

    const getPerformanceLevel = (grade) => {
        if (grade >= 9) return { level: 'Xuất sắc', color: '#4caf50' };
        if (grade >= 8) return { level: 'Giỏi', color: '#8bc34a' };
        if (grade >= 7) return { level: 'Khá', color: '#ffc107' };
        if (grade >= 6) return { level: 'Trung bình', color: '#ff9800' };
        if (grade >= 5) return { level: 'Yếu', color: '#f44336' };
        return { level: 'Kém', color: '#d32f2f' };
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
                    Đang tải báo cáo môn học...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header với Breadcrumb */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link color="inherit" href="/lecturer">
                        Dashboard
                    </Link>
                    <Link color="inherit" href="/lecturer/courses">
                        Môn học
                    </Link>
                    <Typography color="text.primary">Báo cáo {reportData?.courseInfo.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                                <Code sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
                                    📊 {reportData?.courseInfo.name}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Mã môn: {reportData?.courseInfo.code} • {reportData?.courseInfo.credits} tín chỉ
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {reportData?.courseInfo.semester} • {reportData?.courseInfo.totalClasses} lớp • {reportData?.courseInfo.totalStudents} sinh viên
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Học kỳ</InputLabel>
                            <Select
                                value={selectedSemester}
                                label="Học kỳ"
                                onChange={handleSemesterChange}
                            >
                                <MenuItem value="current">HK1 2024-2025</MenuItem>
                                <MenuItem value="previous1">HK3 2023-2024</MenuItem>
                                <MenuItem value="previous2">HK2 2023-2024</MenuItem>
                                <MenuItem value="previous3">HK1 2023-2024</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Lớp</InputLabel>
                            <Select
                                value={selectedClass}
                                label="Lớp"
                                onChange={handleClassChange}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="k19a">K19A</MenuItem>
                                <MenuItem value="k19b">K19B</MenuItem>
                                <MenuItem value="k19c">K19C</MenuItem>
                                <MenuItem value="k18d">K18D</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchCourseReportData}
                        >
                            Làm mới
                        </Button>
                        
                        <Button
                            variant="contained"
                            startIcon={<GetApp />}
                            sx={{ background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}
                        >
                            Xuất báo cáo
                        </Button>
                    </Box>
                </Box>

                {/* Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<PeopleAlt />}
                            title="Sinh viên"
                            value={reportData?.overview.totalStudents || 0}
                            subtitle="Tổng số học viên"
                            trend={5.2}
                            gradientColors={['#667eea', '#764ba2']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<Grade />}
                            title="Điểm TB"
                            value={reportData?.overview.avgGrade || 0}
                            subtitle="Điểm trung bình chung"
                            trend={2.8}
                            gradientColors={['#f093fb', '#f5576c']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<CheckCircle />}
                            title="Tỷ lệ đậu"
                            value={`${reportData?.overview.passRate}%` || '0%'}
                            subtitle="Sinh viên đạt điểm"
                            trend={3.4}
                            gradientColors={['#4facfe', '#00f2fe']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<EmojiEvents />}
                            title="Xuất sắc"
                            value={`${reportData?.overview.excellentRate}%` || '0%'}
                            subtitle="Điểm từ 9.0 trở lên"
                            trend={4.1}
                            gradientColors={['#43e97b', '#38f9d7']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<Schedule />}
                            title="Chuyên cần"
                            value={`${reportData?.overview.attendanceRate}%` || '0%'}
                            subtitle="Tỷ lệ tham gia"
                            trend={1.8}
                            gradientColors={['#fa709a', '#fee140']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<Assignment />}
                            title="Hoàn thành"
                            value={`${reportData?.overview.assignmentCompletionRate}%` || '0%'}
                            subtitle="Nộp bài đúng hạn"
                            trend={-1.2}
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
                    <Tab icon={<Class />} label="So sánh lớp học" />
                    <Tab icon={<BarChart />} label="Phân bố điểm" />
                    <Tab icon={<Timeline />} label="Tiến độ học tập" />
                    <Tab icon={<Assignment />} label="Bài tập & Kiểm tra" />
                    <Tab icon={<EmojiEvents />} label="Sinh viên giỏi" />
                    <Tab icon={<Warning />} label="Sinh viên yếu" />
                    <Tab icon={<Analytics />} label="Đánh giá kỹ năng" />
                    <Tab icon={<CompareArrows />} label="So sánh khóa học" />
                </Tabs>

                <CardContent sx={{ p: 4 }}>
                    {/* Tab 0: Class Comparison */}
                    {selectedTab === 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                So sánh hiệu suất giữa các lớp học
                            </Typography>
                            
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {reportData?.classes.map((classData, index) => (
                                    <Grid item xs={12} md={6} lg={3} key={index}>
                                        <Card sx={{ 
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            '&:hover': { boxShadow: 4 },
                                            position: 'relative'
                                        }}>
                                            {index === 0 && (
                                                <Chip
                                                    label="TOP CLASS"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: 8,
                                                        bgcolor: '#4caf50',
                                                        color: 'white',
                                                        fontWeight: 600
                                                    }}
                                                />
                                            )}
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: getGradeColor(classData.avgGrade), 
                                                        mr: 2,
                                                        width: 48,
                                                        height: 48
                                                    }}>
                                                        <Class />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            Lớp {classData.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {classData.students} sinh viên
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid item xs={6}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" sx={{ 
                                                                fontWeight: 700, 
                                                                color: getGradeColor(classData.avgGrade)
                                                            }}>
                                                                {classData.avgGrade}
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
                                                                color: '#4caf50'
                                                            }}>
                                                                {classData.passRate}%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Tỷ lệ đậu
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        Chuyên cần: {classData.attendanceRate}%
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={classData.attendanceRate}
                                                        sx={{ height: 6, borderRadius: 3, mb: 1 }}
                                                    />
                                                </Box>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        Hoàn thành BT: {classData.completionRate}%
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={classData.completionRate}
                                                        color="warning"
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Grid container spacing={1}>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                                {classData.excellentCount}
                                                            </Typography>
                                                            <Typography variant="caption">Xuất sắc</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#8bc34a', fontWeight: 600 }}>
                                                                {classData.goodCount}
                                                            </Typography>
                                                            <Typography variant="caption">Giỏi</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#ffc107', fontWeight: 600 }}>
                                                                {classData.averageCount}
                                                            </Typography>
                                                            <Typography variant="caption">Khá</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                                                                {classData.belowAverageCount}
                                                            </Typography>
                                                            <Typography variant="caption">Yếu</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Comparison Chart */}
                            <Card sx={{ mt: 3 }}>
                                <CardHeader title="Biểu đồ so sánh các lớp" />
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RechartsBarChart data={reportData?.classes || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="name" stroke="#666" />
                                            <YAxis stroke="#666" />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Bar dataKey="avgGrade" fill="#1976d2" name="Điểm TB" />
                                            <Bar dataKey="passRate" fill="#4caf50" name="Tỷ lệ đậu (%)" />
                                            <Bar dataKey="attendanceRate" fill="#ff9800" name="Chuyên cần (%)" />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Box>
                    )}

                    {/* Tab 1: Grade Distribution */}
                    {selectedTab === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Phân bố điểm số toàn môn học
                                </Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RechartsBarChart data={reportData?.gradeDistribution || []}>
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
                                {reportData?.gradeDistribution.map((item, index) => (
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

                    {/* Tab 2: Learning Progress */}
                    {selectedTab === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Tiến độ học tập theo thời gian
                            </Typography>
                            <ResponsiveContainer width="100%" height={450}>
                                <ComposedChart data={reportData?.progressOverTime || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="week" stroke="#666" />
                                    <YAxis yAxisId="left" stroke="#666" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#666" />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Area 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="attendance" 
                                        fill="#e3f2fd" 
                                        stroke="#2196f3" 
                                        fillOpacity={0.6} 
                                        name="Chuyên cần (%)" 
                                    />
                                    <Bar yAxisId="right" dataKey="passRate" fill="#4caf50" name="Tỷ lệ đậu (%)" />
                                    <Line 
                                        yAxisId="left" 
                                        type="monotone" 
                                        dataKey="avgGrade" 
                                        stroke="#ff7300" 
                                        strokeWidth={3} 
                                        name="Điểm TB" 
                                    />
                                    <Line 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="completion" 
                                        stroke="#9c27b0" 
                                        strokeWidth={2} 
                                        name="Hoàn thành BT (%)" 
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Box>
                    )}

                    {/* Tab 3: Assignments & Tests */}
                    {selectedTab === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Chi tiết bài tập và kiểm tra
                            </Typography>
                            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell><strong>Tên bài tập/Kiểm tra</strong></TableCell>
                                            <TableCell align="center"><strong>Loại</strong></TableCell>
                                            <TableCell align="center"><strong>Hạn nộp</strong></TableCell>
                                            <TableCell align="center"><strong>Đã nộp</strong></TableCell>
                                            <TableCell align="center"><strong>Điểm TB</strong></TableCell>
                                            <TableCell align="center"><strong>Cao nhất</strong></TableCell>
                                            <TableCell align="center"><strong>Thấp nhất</strong></TableCell>
                                            <TableCell align="center"><strong>Đúng hạn</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reportData?.assignments.map((assignment, index) => (
                                            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {assignment.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={assignment.type}
                                                        size="small"
                                                        color={assignment.type === 'Kiểm tra' ? 'error' : assignment.type === 'Dự án' ? 'warning' : 'primary'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {assignment.submitted}/{assignment.total}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ({Math.round((assignment.submitted/assignment.total)*100)}%)
                                                    </Typography>
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
                                                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                        {assignment.maxGrade}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 600 }}>
                                                        {assignment.minGrade}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                                                            {assignment.onTime}
                                                        </Typography>
                                                        {assignment.late > 0 && (
                                                            <Typography variant="caption" sx={{ color: '#f44336' }}>
                                                                Trễ: {assignment.late}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Tab 4: Top Performers */}
                    {selectedTab === 4 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Top sinh viên xuất sắc của môn học
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
                                                    label="TOP 1 TOÀN KHÓA"
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
                                                        width: 56, 
                                                        height: 56,
                                                        mr: 2,
                                                        fontSize: '1.5rem',
                                                        fontWeight: 700
                                                    }}>
                                                        #{student.ranking}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {student.studentId} • Lớp {student.class}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid item xs={4}>
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
                                                    <Grid item xs={4}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" sx={{ 
                                                                fontWeight: 700, 
                                                                color: '#4caf50'
                                                            }}>
                                                                {student.attendance}%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Chuyên cần
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" sx={{ 
                                                                fontWeight: 700, 
                                                                color: '#2196f3'
                                                            }}>
                                                                {student.assignments}%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Bài tập
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Chip
                                                        icon={<TrendingUp />}
                                                        label={`Tiến bộ +${student.improvement}%`}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={getPerformanceLevel(student.grade).level}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getPerformanceLevel(student.grade).color,
                                                            color: 'white',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 5: Struggling Students */}
                    {selectedTab === 5 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Sinh viên cần hỗ trợ
                            </Typography>
                            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                                <Typography variant="body2">
                                    Danh sách sinh viên có kết quả học tập thấp hoặc gặp khó khăn trong môn học này.
                                    Cần có biện pháp hỗ trợ và theo dõi đặc biệt.
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
                                                        width: 56,
                                                        height: 56
                                                    }}>
                                                        <Warning />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {student.studentId} • Lớp {student.class}
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
                                                        color: '#f44336'
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
                                                    Vấn đề:
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
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                    Lần nộp cuối: {new Date(student.lastSubmission).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={2}>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    startIcon={<Person />}
                                                    fullWidth
                                                    onClick={() => setSelectedStudent(student)}
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

                    {/* Tab 6: Skills Assessment */}
                    {selectedTab === 6 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Đánh giá kỹ năng theo môn học
                                </Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={reportData?.skills.assessment || []}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="skill" />
                                        <PolarRadiusAxis angle={0} domain={[0, 10]} />
                                        <Radar
                                            name="Điểm trung bình"
                                            dataKey="avgScore"
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
                                    Chi tiết đánh giá kỹ năng
                                </Typography>
                                {reportData?.skills.assessment.map((skill, index) => (
                                    <Box key={index} sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {skill.skill}
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {skill.avgScore}/{skill.maxScore}
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(skill.avgScore / skill.maxScore) * 100}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                bgcolor: '#f0f0f0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getGradeColor(skill.avgScore)
                                                }
                                            }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            {skill.students} sinh viên đã đánh giá • 
                                            Mức độ: {getPerformanceLevel(skill.avgScore).level}
                                        </Typography>
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    )}

                    {/* Tab 7: Course Comparison */}
                    {selectedTab === 7 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    So sánh với các học kỳ trước
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={reportData?.comparison.previousSemesters || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="semester" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="avgGrade" stroke="#1976d2" strokeWidth={3} name="Điểm TB" />
                                        <Line type="monotone" dataKey="passRate" stroke="#4caf50" strokeWidth={2} name="Tỷ lệ đậu (%)" />
                                    </LineChart>
                                </ResponsiveContainer>
                                
                                <Box sx={{ mt: 2 }}>
                                    {reportData?.comparison.previousSemesters.map((semester, index) => (
                                        <Box key={index} sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            p: 2,
                                            mb: 1,
                                            bgcolor: '#f8f9fa',
                                            borderRadius: 2
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {semester.semester}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Typography variant="body2">
                                                    ĐTB: <strong>{semester.avgGrade}</strong>
                                                </Typography>
                                                <Typography variant="body2">
                                                    Đậu: <strong>{semester.passRate}%</strong>
                                                </Typography>
                                                <Typography variant="body2">
                                                    SV: <strong>{semester.students}</strong>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    So sánh với các môn học khác
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsBarChart data={[...reportData?.comparison.otherCourses, { course: 'Phát triển ứng dụng Web', avgGrade: reportData?.overview.avgGrade, passRate: reportData?.overview.passRate }] || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="course" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="avgGrade" fill="#ff7300" name="Điểm TB" />
                                        <Bar dataKey="passRate" fill="#8884d8" name="Tỷ lệ đậu (%)" />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                                
                                <Box sx={{ mt: 2 }}>
                                    {[...reportData?.comparison.otherCourses, { course: 'Phát triển ứng dụng Web', avgGrade: reportData?.overview.avgGrade, passRate: reportData?.overview.passRate }].map((course, index) => (
                                        <Box key={index} sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            p: 2,
                                            mb: 1,
                                            bgcolor: '#f8f9fa',
                                            borderRadius: 2,
                                            border: course.course === 'Phát triển ứng dụng Web' ? '2px solid #1976d2' : '1px solid #e0e0e0'
                                        }}>
                                            <Typography variant="body2" sx={{ 
                                                fontWeight: course.course === 'Phát triển ứng dụng Web' ? 600 : 500 
                                            }}>
                                                {course.course}
                                                {course.course === 'Phát triển ứng dụng Web' && (
                                                    <Chip 
                                                        label="Môn hiện tại" 
                                                        size="small" 
                                                        color="primary" 
                                                        sx={{ ml: 1 }} 
                                                    />
                                                )}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Typography variant="body2">
                                                    ĐTB: <strong style={{ color: getGradeColor(course.avgGrade) }}>
                                                        {course.avgGrade}
                                                    </strong>
                                                </Typography>
                                                <Typography variant="body2">
                                                    Đậu: <strong>{course.passRate}%</strong>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Additional Analysis Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Resource Usage */}
                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Sử dụng tài liệu học tập"
                            subheader="Thống kê truy cập tài liệu môn học"
                            avatar={<VideoLibrary color="primary" />}
                        />
                        <CardContent>
                            {reportData?.engagement.resourceUsage.map((resource, index) => (
                                <Box key={index} sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {resource.resource}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Chip 
                                                icon={<Visibility />} 
                                                label={`${resource.views} lượt xem`} 
                                                size="small" 
                                                color="primary" 
                                                variant="outlined" 
                                            />
                                            {resource.downloads && (
                                                <Chip 
                                                    icon={<Download />} 
                                                    label={`${resource.downloads} tải về`} 
                                                    size="small" 
                                                    color="success" 
                                                    variant="outlined" 
                                                />
                                            )}
                                            {resource.duration && (
                                                <Chip 
                                                    icon={<AccessTime />} 
                                                    label={resource.duration} 
                                                    size="small" 
                                                    color="warning" 
                                                    variant="outlined" 
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min((resource.views / 3000) * 100, 100)}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: '#f0f0f0',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: `hsl(${index * 60}, 70%, 50%)`
                                            }
                                        }}
                                    />
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Engagement Activities */}
                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Hoạt động tham gia"
                            subheader="Mức độ tương tác của sinh viên"
                            avatar={<Analytics color="success" />}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={reportData?.engagement.activities || []}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="activity" tick={{ fontSize: 12 }} />
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
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Course Summary */}
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardHeader 
                    title="Tóm tắt báo cáo môn học"
                    subheader="Những điểm nổi bật và khuyến nghị"
                    avatar={<Assessment color="primary" />}
                />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50' }}>
                                <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600, mb: 2 }}>
                                    🎯 Điểm mạnh
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Tỷ lệ đậu cao ({reportData?.overview.passRate}%)
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Nhiều sinh viên xuất sắc ({reportData?.overview.excellentRate}%)
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Chuyên cần tốt ({reportData?.overview.attendanceRate}%)
                                </Typography>
                                <Typography variant="body2">
                                    • Lớp {reportData?.classes[0]?.name} có hiệu suất cao nhất
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 2, border: '1px solid #ff9800' }}>
                                <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 600, mb: 2 }}>
                                    ⚠️ Cần cải thiện
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Tỷ lệ nộp bài đúng hạn chưa cao ({reportData?.overview.assignmentCompletionRate}%)
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Một số sinh viên vắng học nhiều
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Cần tăng cường thảo luận trực tuyến
                                </Typography>
                                <Typography variant="body2">
                                    • Hỗ trợ thêm cho {reportData?.strugglingStudents?.length} sinh viên yếu
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px solid #2196f3' }}>
                                <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 600, mb: 2 }}>
                                    💡 Khuyến nghị
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Tăng cường bài tập thực hành
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Tổ chức thêm buổi học bù cho sinh viên yếu
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Khuyến khích thảo luận nhóm
                                </Typography>
                                <Typography variant="body2">
                                    • Cập nhật tài liệu học tập mới
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

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
                                Chi tiết sinh viên: {selectedStudent?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedStudent?.studentId} • Lớp {selectedStudent?.class} • Môn {reportData?.courseInfo.name}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
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
                                <Chip
                                    label={getPerformanceLevel(selectedStudent.grade).level}
                                    sx={{
                                        bgcolor: getPerformanceLevel(selectedStudent.grade).color,
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Tỷ lệ chuyên cần
                                </Typography>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    color: '#4caf50',
                                    mb: 2
                                }}>
                                    {selectedStudent.attendance}%
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Hoàn thành bài tập
                                </Typography>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    color: '#2196f3',
                                    mb: 2
                                }}>
                                    {selectedStudent.assignments}%
                                </Typography>
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
                            {selectedStudent.lastSubmission && (
                                <Grid item xs={12}>
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Lần nộp bài cuối:</strong> {new Date(selectedStudent.lastSubmission).toLocaleDateString('vi-VN')}
                                        </Typography>
                                    </Alert>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Đóng
                    </Button>
                    <Button variant="contained" startIcon={<Feedback />}>
                        Gửi phản hồi
                    </Button>
                    <Button variant="contained" color="warning" startIcon={<Person />}>
                        Lên kế hoạch hỗ trợ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CourseReport;