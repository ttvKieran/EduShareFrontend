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
    CompareArrows,
    PersonAdd,
    Event,
    LocationOn,
    Phone,
    Email,
    AccountCircle,
    Subject,
    Today,
    CalendarViewWeek,
    Edit,
    Send
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

const ClassReport = () => {
    const { classId } = useParams();
    const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('current');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [reportData, setReportData] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Mock data cho báo cáo lớp học
    const mockData = {
        classInfo: {
            id: 'K19A',
            name: 'Lớp K19A - Công nghệ thông tin',
            code: 'K19A',
            department: 'Khoa Công nghệ thông tin',
            academicYear: '2019-2023',
            currentSemester: 'HK1 2024-2025',
            totalStudents: 42,
            advisor: 'TS. Nguyễn Văn A',
            monitor: 'Nguyễn Thị Mai',
            viceMonitor: 'Trần Văn Hùng',
            secretary: 'Lê Thị Lan',
            startDate: '2019-09-01',
            expectedGraduation: '2023-06-30'
        },
        overview: {
            totalStudents: 42,
            maleStudents: 28,
            femaleStudents: 14,
            avgGPA: 7.8,
            excellentStudents: 9,
            goodStudents: 18,
            averageStudents: 12,
            weakStudents: 3,
            currentSemesterGPA: 7.6,
            overallAttendanceRate: 91.2,
            disciplinaryIssues: 2,
            scholarshipRecipients: 12,
            graduationProgress: 76.5
        },
        subjects: [
            {
                id: 'IT301',
                name: 'Phát triển ứng dụng Web',
                code: 'IT301',
                credits: 3,
                instructor: 'TS. Nguyễn Văn A',
                avgGrade: 7.8,
                passRate: 88.1,
                attendanceRate: 92.3,
                excellentCount: 9,
                goodCount: 18,
                averageCount: 10,
                weakCount: 5
            },
            {
                id: 'IT302',
                name: 'Cơ sở dữ liệu nâng cao',
                code: 'IT302',
                credits: 3,
                instructor: 'ThS. Trần Thị B',
                avgGrade: 7.4,
                passRate: 83.3,
                attendanceRate: 89.5,
                excellentCount: 6,
                goodCount: 15,
                averageCount: 14,
                weakCount: 7
            },
            {
                id: 'IT303',
                name: 'Lập trình di động',
                code: 'IT303',
                credits: 3,
                instructor: 'TS. Lê Văn C',
                avgGrade: 7.6,
                passRate: 85.7,
                attendanceRate: 90.8,
                excellentCount: 8,
                goodCount: 16,
                averageCount: 12,
                weakCount: 6
            },
            {
                id: 'IT304',
                name: 'Mạng máy tính',
                code: 'IT304',
                credits: 3,
                instructor: 'ThS. Phạm Thị D',
                avgGrade: 7.2,
                passRate: 81.0,
                attendanceRate: 88.1,
                excellentCount: 5,
                goodCount: 14,
                averageCount: 15,
                weakCount: 8
            },
            {
                id: 'GE201',
                name: 'Tư tưởng Hồ Chí Minh',
                code: 'GE201',
                credits: 2,
                instructor: 'ThS. Hoàng Văn E',
                avgGrade: 8.1,
                passRate: 95.2,
                attendanceRate: 94.3,
                excellentCount: 12,
                goodCount: 20,
                averageCount: 8,
                weakCount: 2
            }
        ],
        studentList: [
            {
                id: 1,
                studentId: 'SV19001',
                name: 'Nguyễn Thị Mai',
                email: 'mai.nt@student.edu.vn',
                phone: '0901234567',
                address: 'Hà Nội',
                gpa: 9.2,
                currentSemesterGPA: 9.0,
                attendanceRate: 98,
                disciplinaryScore: 100,
                scholarships: ['Học bổng khuyến học', 'Học bổng tài năng'],
                achievements: ['Sinh viên xuất sắc', 'Giải nhất Olympic Tin học'],
                warnings: [],
                status: 'Đang học',
                isMonitor: true
            },
            {
                id: 2,
                studentId: 'SV19002',
                name: 'Trần Văn Hùng',
                email: 'hung.tv@student.edu.vn',
                phone: '0901234568',
                address: 'Hồ Chí Minh',
                gpa: 8.8,
                currentSemesterGPA: 8.6,
                attendanceRate: 95,
                disciplinaryScore: 98,
                scholarships: ['Học bổng khuyến học'],
                achievements: ['Sinh viên giỏi'],
                warnings: [],
                status: 'Đang học',
                isViceMonitor: true
            },
            {
                id: 3,
                studentId: 'SV19003',
                name: 'Lê Thị Lan',
                email: 'lan.lt@student.edu.vn',
                phone: '0901234569',
                address: 'Đà Nẵng',
                gpa: 8.5,
                currentSemesterGPA: 8.3,
                attendanceRate: 92,
                disciplinaryScore: 95,
                scholarships: [],
                achievements: ['Sinh viên giỏi'],
                warnings: [],
                status: 'Đang học',
                isSecretary: true
            },
            // Add more students...
            {
                id: 40,
                studentId: 'SV19040',
                name: 'Phạm Văn Nam',
                email: 'nam.pv@student.edu.vn',
                phone: '0901234607',
                address: 'Hải Phòng',
                gpa: 4.8,
                currentSemesterGPA: 4.5,
                attendanceRate: 72,
                disciplinaryScore: 85,
                scholarships: [],
                achievements: [],
                warnings: ['Cảnh cáo học tập', 'Thiếu tín chỉ'],
                status: 'Nguy cơ thôi học'
            }
        ],
        academicProgress: [
            { semester: 'HK1 2019', avgGPA: 6.8, passRate: 78, enrolledStudents: 42 },
            { semester: 'HK2 2020', avgGPA: 7.1, passRate: 82, enrolledStudents: 41 },
            { semester: 'HK1 2020', avgGPA: 7.3, passRate: 85, enrolledStudents: 40 },
            { semester: 'HK2 2021', avgGPA: 7.5, passRate: 87, enrolledStudents: 39 },
            { semester: 'HK1 2021', avgGPA: 7.6, passRate: 88, enrolledStudents: 39 },
            { semester: 'HK2 2022', avgGPA: 7.7, passRate: 89, enrolledStudents: 38 },
            { semester: 'HK1 2022', avgGPA: 7.8, passRate: 90, enrolledStudents: 38 },
            { semester: 'HK2 2023', avgGPA: 7.9, passRate: 91, enrolledStudents: 37 },
            { semester: 'HK1 2023', avgGPA: 7.8, passRate: 89, enrolledStudents: 37 },
            { semester: 'HK1 2024', avgGPA: 7.6, passRate: 88, enrolledStudents: 36 }
        ],
        attendance: {
            overall: 91.2,
            bySubject: [
                { subject: 'Phát triển ứng dụng Web', rate: 92.3, sessions: 45, attended: 1866 },
                { subject: 'Cơ sở dữ liệu nâng cao', rate: 89.5, sessions: 45, attended: 1698 },
                { subject: 'Lập trình di động', rate: 90.8, sessions: 30, attended: 1145 },
                { subject: 'Mạng máy tính', rate: 88.1, sessions: 45, attended: 1664 },
                { subject: 'Tư tưởng Hồ Chí Minh', rate: 94.3, sessions: 30, attended: 1190 }
            ]
        },
        disciplinary: {
            excellent: 28,
            good: 10,
            average: 2,
            weak: 2,
            issues: [
                {
                    studentId: 'SV19025',
                    studentName: 'Hoàng Văn Dũng',
                    issue: 'Vắng học không phép',
                    date: '2024-10-15',
                    penalty: 'Cảnh cáo',
                    status: 'Đã xử lý'
                },
                {
                    studentId: 'SV19040',
                    studentName: 'Phạm Văn Nam',
                    issue: 'Không hoàn thành bài tập',
                    date: '2024-11-01',
                    penalty: 'Nhắc nhở',
                    status: 'Đang theo dõi'
                }
            ]
        },
        activities: [
            {
                id: 1,
                name: 'Chuyến tham quan công ty ABC',
                type: 'Ngoại khóa',
                date: '2024-10-20',
                participants: 38,
                organizer: 'Ban chủ nhiệm lớp'
            },
            {
                id: 2,
                name: 'Cuộc thi lập trình ACM',
                type: 'Học thuật',
                date: '2024-11-15',
                participants: 15,
                organizer: 'Khoa CNTT'
            },
            {
                id: 3,
                name: 'Hoạt động tình nguyện',
                type: 'Xã hội',
                date: '2024-12-01',
                participants: 32,
                organizer: 'Đoàn thanh niên'
            }
        ],
        finance: {
            tuitionPaid: 39,
            tuitionPending: 3,
            scholarshipRecipients: 12,
            totalScholarshipAmount: 180000000,
            averageScholarshipPerStudent: 15000000
        }
    };

    useEffect(() => {
        fetchClassReportData();
    }, [classId, selectedPeriod, selectedSubject]);

    const fetchClassReportData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setReportData(mockData);
        } catch (error) {
            console.error('Error fetching class report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const getGPAColor = (gpa) => {
        if (gpa >= 8.5) return '#4caf50';
        if (gpa >= 7.0) return '#8bc34a';
        if (gpa >= 6.5) return '#ffc107';
        if (gpa >= 5.0) return '#ff9800';
        return '#f44336';
    };

    const getPerformanceLevel = (gpa) => {
        if (gpa >= 8.5) return { level: 'Xuất sắc', color: '#4caf50' };
        if (gpa >= 7.0) return { level: 'Giỏi', color: '#8bc34a' };
        if (gpa >= 6.5) return { level: 'Khá', color: '#ffc107' };
        if (gpa >= 5.0) return { level: 'Trung bình', color: '#ff9800' };
        return { level: 'Yếu', color: '#f44336' };
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
                    Đang tải báo cáo lớp học...
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
                    <Link color="inherit" href="/lecturer/classes">
                        Lớp học
                    </Link>
                    <Typography color="text.primary">Báo cáo {reportData?.classInfo.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                                <Class sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
                                    📋 {reportData?.classInfo.name}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Mã lớp: {reportData?.classInfo.code} • {reportData?.classInfo.department}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Khóa {reportData?.classInfo.academicYear} • {reportData?.classInfo.totalStudents} sinh viên • GVCN: {reportData?.classInfo.advisor}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Kỳ học</InputLabel>
                            <Select
                                value={selectedPeriod}
                                label="Kỳ học"
                                onChange={handlePeriodChange}
                            >
                                <MenuItem value="current">HK1 2024-2025</MenuItem>
                                <MenuItem value="previous1">HK2 2023-2024</MenuItem>
                                <MenuItem value="previous2">HK1 2023-2024</MenuItem>
                                <MenuItem value="all">Toàn khóa</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Môn học</InputLabel>
                            <Select
                                value={selectedSubject}
                                label="Môn học"
                                onChange={handleSubjectChange}
                            >
                                <MenuItem value="all">Tất cả môn</MenuItem>
                                <MenuItem value="it301">Phát triển ứng dụng Web</MenuItem>
                                <MenuItem value="it302">Cơ sở dữ liệu nâng cao</MenuItem>
                                <MenuItem value="it303">Lập trình di động</MenuItem>
                                <MenuItem value="it304">Mạng máy tính</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchClassReportData}
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

                {/* Class Leadership Info */}
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            👥 Ban chủ nhiệm lớp
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
                                        <AccountCircle />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {reportData?.classInfo.advisor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Giáo viên chủ nhiệm
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>
                                        <Star />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {reportData?.classInfo.monitor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Lớp trưởng
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#ff9800', width: 48, height: 48 }}>
                                        <Person />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {reportData?.classInfo.viceMonitor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Lớp phó
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#9c27b0', width: 48, height: 48 }}>
                                        <Edit />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {reportData?.classInfo.secretary}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Thư ký
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<PeopleAlt />}
                            title="Sĩ số"
                            value={reportData?.overview.totalStudents || 0}
                            subtitle={`${reportData?.overview.maleStudents}👨 ${reportData?.overview.femaleStudents}👩`}
                            trend={-2.3}
                            gradientColors={['#667eea', '#764ba2']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<Grade />}
                            title="GPA TB"
                            value={reportData?.overview.avgGPA || 0}
                            subtitle="Điểm trung bình lớp"
                            trend={2.1}
                            gradientColors={['#f093fb', '#f5576c']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<EmojiEvents />}
                            title="Xuất sắc"
                            value={reportData?.overview.excellentStudents || 0}
                            subtitle="Sinh viên GPA ≥ 8.5"
                            trend={12.5}
                            gradientColors={['#43e97b', '#38f9d7']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<Schedule />}
                            title="Chuyên cần"
                            value={`${reportData?.overview.overallAttendanceRate}%` || '0%'}
                            subtitle="Tỷ lệ đi học trung bình"
                            trend={1.8}
                            gradientColors={['#fa709a', '#fee140']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<School />}
                            title="Học bổng"
                            value={reportData?.overview.scholarshipRecipients || 0}
                            subtitle="Sinh viên nhận học bổng"
                            trend={8.3}
                            gradientColors={['#a8edea', '#fed6e3']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <StatCard
                            icon={<Timeline />}
                            title="Tiến độ TN"
                            value={`${reportData?.overview.graduationProgress}%` || '0%'}
                            subtitle="Hoàn thành chương trình"
                            trend={5.7}
                            gradientColors={['#4facfe', '#00f2fe']}
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
                    <Tab icon={<Subject />} label="Kết quả học tập" />
                    <Tab icon={<PeopleAlt />} label="Danh sách sinh viên" />
                    <Tab icon={<Timeline />} label="Tiến độ học tập" />
                    <Tab icon={<CheckCircle />} label="Chuyên cần" />
                    <Tab icon={<Assessment />} label="Kỷ luật & Rèn luyện" />
                    <Tab icon={<Event />} label="Hoạt động lớp" />
                    <Tab icon={<School />} label="Học phí & Học bổng" />
                </Tabs>

                <CardContent sx={{ p: 4 }}>
                    {/* Tab 0: Academic Results */}
                    {selectedTab === 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Kết quả học tập theo môn học
                            </Typography>
                            
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {reportData?.subjects.map((subject, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <Card sx={{ 
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            '&:hover': { boxShadow: 4 },
                                            height: '100%'
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: getGPAColor(subject.avgGrade), 
                                                        mr: 2,
                                                        width: 48,
                                                        height: 48
                                                    }}>
                                                        <MenuBook />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                                            {subject.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {subject.code} • {subject.credits} tín chỉ
                                                        </Typography>                                                    

                                                        <Typography variant="caption" color="text.secondary">
                                                            GV: {subject.instructor}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid item xs={6}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" sx={{ 
                                                                fontWeight: 700, 
                                                                color: getGPAColor(subject.avgGrade)
                                                            }}>
                                                                {subject.avgGrade}
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
                                                                {subject.passRate}%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Tỷ lệ đậu
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        Chuyên cần: {subject.attendanceRate}%
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={subject.attendanceRate}
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Grid container spacing={1}>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                                {subject.excellentCount}
                                                            </Typography>
                                                            <Typography variant="caption">Xuất sắc</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#8bc34a', fontWeight: 600 }}>
                                                                {subject.goodCount}
                                                            </Typography>
                                                            <Typography variant="caption">Giỏi</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#ffc107', fontWeight: 600 }}>
                                                                {subject.averageCount}
                                                            </Typography>
                                                            <Typography variant="caption">Khá</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                                                                {subject.weakCount}
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

                            {/* Subject Comparison Chart */}
                            <Card sx={{ mt: 3 }}>
                                <CardHeader title="Biểu đồ so sánh kết quả các môn học" />
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RechartsBarChart data={reportData?.subjects || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="code" stroke="#666" />
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

                    {/* Tab 1: Student List */}
                    {selectedTab === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Danh sách sinh viên lớp {reportData?.classInfo.code}
                                </Typography>
                                <Box>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PersonAdd />}
                                        sx={{ mr: 2 }}
                                    >
                                        Thêm sinh viên
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<GetApp />}
                                    >
                                        Xuất danh sách
                                    </Button>
                                </Box>
                            </Box>

                            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell><strong>STT</strong></TableCell>
                                            <TableCell><strong>MSSV</strong></TableCell>
                                            <TableCell><strong>Họ và tên</strong></TableCell>
                                            <TableCell><strong>Vai trò</strong></TableCell>
                                            <TableCell align="center"><strong>GPA</strong></TableCell>
                                            <TableCell align="center"><strong>GPA HK</strong></TableCell>
                                            <TableCell align="center"><strong>Chuyên cần</strong></TableCell>
                                            <TableCell align="center"><strong>Rèn luyện</strong></TableCell>
                                            <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                            <TableCell align="center"><strong>Thao tác</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reportData?.studentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
                                            <TableRow key={student.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {student.studentId}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar sx={{ 
                                                            bgcolor: getGPAColor(student.gpa), 
                                                            mr: 2,
                                                            width: 40,
                                                            height: 40
                                                        }}>
                                                            <Person />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {student.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {student.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {student.isMonitor && (
                                                        <Chip label="Lớp trưởng" color="primary" size="small" sx={{ mb: 0.5 }} />
                                                    )}
                                                    {student.isViceMonitor && (
                                                        <Chip label="Lớp phó" color="secondary" size="small" sx={{ mb: 0.5 }} />
                                                    )}
                                                    {student.isSecretary && (
                                                        <Chip label="Thư ký" color="success" size="small" sx={{ mb: 0.5 }} />
                                                    )}
                                                    {!student.isMonitor && !student.isViceMonitor && !student.isSecretary && (
                                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 600, 
                                                        color: getGPAColor(student.gpa) 
                                                    }}>
                                                        {student.gpa}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 600, 
                                                        color: getGPAColor(student.currentSemesterGPA) 
                                                    }}>
                                                        {student.currentSemesterGPA}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {student.attendanceRate}%
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {student.disciplinaryScore}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={student.status}
                                                        size="small"
                                                        color={student.status === 'Đang học' ? 'success' : 'error'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setDialogOpen(true);
                                                        }}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={reportData?.studentList.length || 0}
                                    page={page}
                                    onPageChange={(event, newPage) => setPage(newPage)}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={(event) => {
                                        setRowsPerPage(parseInt(event.target.value, 10));
                                        setPage(0);
                                    }}
                                    labelRowsPerPage="Số dòng mỗi trang:"
                                />
                            </TableContainer>
                        </Box>
                    )}

                    {/* Tab 2: Academic Progress */}
                    {selectedTab === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Tiến độ học tập qua các học kỳ
                            </Typography>
                            <ResponsiveContainer width="100%" height={450}>
                                <ComposedChart data={reportData?.academicProgress || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="semester" stroke="#666" />
                                    <YAxis yAxisId="left" stroke="#666" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#666" />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Area 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="enrolledStudents" 
                                        fill="#e3f2fd" 
                                        stroke="#2196f3" 
                                        fillOpacity={0.6} 
                                        name="Sĩ số" 
                                    />
                                    <Bar yAxisId="right" dataKey="passRate" fill="#4caf50" name="Tỷ lệ đậu (%)" />
                                    <Line 
                                        yAxisId="left" 
                                        type="monotone" 
                                        dataKey="avgGPA" 
                                        stroke="#ff7300" 
                                        strokeWidth={3} 
                                        name="GPA TB" 
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>

                            {/* Progress Summary */}
                            <Grid container spacing={3} sx={{ mt: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 3, bgcolor: '#e8f5e8', border: '1px solid #4caf50' }}>
                                        <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600, mb: 2 }}>
                                            📈 Xu hướng tiến bộ
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • GPA trung bình tăng từ 6.8 lên 7.8 (+14.7%)
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • Tỷ lệ đậu cải thiện từ 78% lên 88% (+10%)
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • Số sinh viên xuất sắc tăng đáng kể
                                        </Typography>
                                        <Typography variant="body2">
                                            • Lớp đang trong giai đoạn ổn định và phát triển
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 3, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                                        <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 600, mb: 2 }}>
                                            ⚠️ Các vấn đề cần lưu ý
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • Sĩ số giảm dần do chuyển trường, thôi học
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • GPA học kỳ hiện tại (7.6) thấp hơn tổng quát (7.8)
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • Cần theo dõi sát sao 3 sinh viên yếu
                                        </Typography>
                                        <Typography variant="body2">
                                            • Tăng cường hỗ trợ cho sinh viên có nguy cơ
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 3: Attendance */}
                    {selectedTab === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Thống kê chuyên cần của lớp
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RechartsBarChart data={reportData?.attendance.bySubject || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="subject" stroke="#666" />
                                            <YAxis stroke="#666" />
                                            <RechartsTooltip />
                                            <Bar dataKey="rate" fill="#1976d2" radius={[4, 4, 0, 0]} />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Chi tiết chuyên cần
                                    </Typography>
                                    {reportData?.attendance.bySubject.map((item, index) => (
                                        <Box key={index} sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {item.subject}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {item.rate}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={item.rate}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: '#f0f0f0',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: item.rate >= 90 ? '#4caf50' : item.rate >= 80 ? '#ffc107' : '#f44336'
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {item.attended}/{item.sessions * reportData?.overview.totalStudents} lượt có mặt
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 4: Disciplinary & Training */}
                    {selectedTab === 4 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Kỷ luật và rèn luyện
                            </Typography>
                            
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            📊 Thống kê rèn luyện
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Xuất sắc', value: reportData?.disciplinary.excellent, fill: '#4caf50' },
                                                        { name: 'Tốt', value: reportData?.disciplinary.good, fill: '#8bc34a' },
                                                        { name: 'Khá', value: reportData?.disciplinary.average, fill: '#ffc107' },
                                                        { name: 'Yếu', value: reportData?.disciplinary.weak, fill: '#f44336' }
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({name, value}) => `${name}: ${value}`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                />
                                                <RechartsTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            ⚠️ Các vấn đề kỷ luật
                                        </Typography>
                                        {reportData?.disciplinary.issues.map((issue, index) => (
                                            <Box key={index} sx={{ 
                                                p: 2, 
                                                mb: 2, 
                                                bgcolor: '#fff3e0', 
                                                borderRadius: 2,
                                                border: '1px solid #ffb74d'
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {issue.studentName} ({issue.studentId})
                                                    </Typography>
                                                    <Chip
                                                        label={issue.status}
                                                        size="small"
                                                        color={issue.status === 'Đã xử lý' ? 'success' : 'warning'}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Vấn đề:</strong> {issue.issue}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    <strong>Hình thức xử lý:</strong> {issue.penalty}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Ngày: {new Date(issue.date).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 5: Class Activities */}
                    {selectedTab === 5 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Hoạt động của lớp
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Event />}
                                >
                                    Thêm hoạt động
                                </Button>
                            </Box>
                            
                            <Grid container spacing={3}>
                                {reportData?.activities.map((activity, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <Card sx={{ 
                                            height: '100%',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            '&:hover': { boxShadow: 4 }
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: activity.type === 'Học thuật' ? '#1976d2' : 
                                                                 activity.type === 'Ngoại khóa' ? '#4caf50' : '#ff9800',
                                                        mr: 2,
                                                        width: 48,
                                                        height: 48
                                                    }}>
                                                        {activity.type === 'Học thuật' ? <School /> : 
                                                         activity.type === 'Ngoại khóa' ? <Event /> : <Announcement />}
                                                    </Avatar>
                                                    <Box>
                                                        <Chip
                                                            label={activity.type}
                                                            size="small"
                                                            color={activity.type === 'Học thuật' ? 'primary' : 
                                                                   activity.type === 'Ngoại khóa' ? 'success' : 'warning'}
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>
                                                
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                                    {activity.name}
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {new Date(activity.date).toLocaleDateString('vi-VN')}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <PeopleAlt sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {activity.participants}/{reportData?.overview.totalStudents} sinh viên tham gia
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <AccountCircle sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {activity.organizer}
                                                    </Typography>
                                                </Box>
                                                
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(activity.participants / reportData?.overview.totalStudents) * 100}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: '#f0f0f0'
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 6: Tuition & Scholarships */}
                    {selectedTab === 6 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Học phí và học bổng
                            </Typography>
                            
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        icon={<CheckCircle />}
                                        title="Đã đóng học phí"
                                        value={reportData?.finance.tuitionPaid || 0}
                                        subtitle={`${reportData?.finance.tuitionPending} chưa đóng`}
                                        trend={5.1}
                                        gradientColors={['#4caf50', '#8bc34a']}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        icon={<Warning />}
                                        title="Chưa đóng HP"
                                        value={reportData?.finance.tuitionPending || 0}
                                        subtitle="Cần theo dõi"
                                        trend={-12.3}
                                        gradientColors={['#f44336', '#ff7043']}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        icon={<EmojiEvents />}
                                        title="Có học bổng"
                                        value={reportData?.finance.scholarshipRecipients || 0}
                                        subtitle="Sinh viên nhận HB"
                                        trend={8.7}
                                        gradientColors={['#ff9800', '#ffb74d']}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        icon={<School />}
                                        title="Tổng HB"
                                        value={`${(reportData?.finance.totalScholarshipAmount / 1000000).toFixed(0)}M`}
                                        subtitle="VNĐ"
                                        trend={15.2}
                                        gradientColors={['#9c27b0', '#ba68c8']}
                                    />
                                </Grid>
                            </Grid>

                            {/* Scholarship Details */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <Card sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            📊 Thống kê học bổng
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Có học bổng', value: reportData?.finance.scholarshipRecipients, fill: '#4caf50' },
                                                        { name: 'Không có học bổng', value: reportData?.overview.totalStudents - reportData?.finance.scholarshipRecipients, fill: '#e0e0e0' }
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                />
                                                <RechartsTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            💰 Chi tiết học bổng
                                        </Typography>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Tổng số tiền:</strong>
                                            </Typography>
                                            <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                                                {reportData?.finance.totalScholarshipAmount.toLocaleString('vi-VN')} VNĐ
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Trung bình/sinh viên:</strong>
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                {reportData?.finance.averageScholarshipPerStudent.toLocaleString('vi-VN')} VNĐ
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Tỷ lệ sinh viên có HB:</strong>
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                                                {Math.round((reportData?.finance.scholarshipRecipients / reportData?.overview.totalStudents) * 100)}%
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Students with pending tuition */}
                            <Card sx={{ mt: 3 }}>
                                <CardHeader 
                                    title="⚠️ Sinh viên chưa đóng học phí"
                                    subheader="Cần liên hệ và nhắc nhở"
                                />
                                <CardContent>
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        Có {reportData?.finance.tuitionPending} sinh viên chưa hoàn thành việc đóng học phí. 
                                        Cần liên hệ và hỗ trợ để đảm bảo không ảnh hưởng đến việc học tập.
                                    </Alert>
                                    
                                    {/* This would typically come from a separate data source */}
                                    <Grid container spacing={2}>
                                        {[
                                            { name: 'Phạm Văn Nam', studentId: 'SV19040', amount: '12,500,000', deadline: '2024-01-15', status: 'Quá hạn' },
                                            { name: 'Trần Thị Hoa', studentId: 'SV19035', amount: '12,500,000', deadline: '2024-01-20', status: 'Sắp hết hạn' },
                                            { name: 'Lê Văn Tùng', studentId: 'SV19028', amount: '6,250,000', deadline: '2024-01-25', status: 'Còn thời gian' }
                                        ].map((student, index) => (
                                            <Grid item xs={12} md={4} key={index}>
                                                <Box sx={{ 
                                                    p: 2, 
                                                    border: '1px solid #ffb74d', 
                                                    borderRadius: 2,
                                                    bgcolor: '#fff3e0'
                                                }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                                        {student.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        MSSV: {student.studentId}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        <strong>Số tiền:</strong> {student.amount} VNĐ
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                                        <strong>Hạn:</strong> {student.deadline}
                                                    </Typography>
                                                    <Chip
                                                        label={student.status}
                                                        size="small"
                                                        color={student.status === 'Quá hạn' ? 'error' : 
                                                               student.status === 'Sắp hết hạn' ? 'warning' : 'info'}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Student Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: selectedStudent ? getGPAColor(selectedStudent.gpa) : 'primary.main', width: 56, height: 56 }}>
                            <Person />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {selectedStudent?.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {selectedStudent?.studentId} • Lớp {reportData?.classInfo.code}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {/* Personal Information */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ p: 3, height: '100%', bgcolor: '#f8f9fa' }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        👤 Thông tin cá nhân
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">{selectedStudent.email}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">{selectedStudent.phone}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">{selectedStudent.address}</Typography>
                                        </Box>
                                    </Box>
                                    
                                    {selectedStudent.isMonitor && (
                                        <Chip label="👑 Lớp trưởng" color="primary" sx={{ mb: 1, mr: 1 }} />
                                    )}
                                    {selectedStudent.isViceMonitor && (
                                        <Chip label="🎖️ Lớp phó" color="secondary" sx={{ mb: 1, mr: 1 }} />
                                    )}
                                    {selectedStudent.isSecretary && (
                                        <Chip label="📝 Thư ký" color="success" sx={{ mb: 1, mr: 1 }} />
                                    )}
                                </Card>
                            </Grid>

                            {/* Academic Performance */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        📚 Kết quả học tập
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ 
                                                    fontWeight: 700, 
                                                    color: getGPAColor(selectedStudent.gpa),
                                                    mb: 1
                                                }}>
                                                    {selectedStudent.gpa}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    GPA tổng quát
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f3e5f5', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ 
                                                    fontWeight: 700, 
                                                    color: getGPAColor(selectedStudent.currentSemesterGPA),
                                                    mb: 1
                                                }}>
                                                    {selectedStudent.currentSemesterGPA}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    GPA học kỳ
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ 
                                                    fontWeight: 700, 
                                                    color: '#4caf50',
                                                    mb: 1
                                                }}>
                                                    {selectedStudent.attendanceRate}%
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Chuyên cần
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ 
                                                    fontWeight: 700, 
                                                    color: '#ff9800',
                                                    mb: 1
                                                }}>
                                                    {selectedStudent.disciplinaryScore}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Rèn luyện
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label={getPerformanceLevel(selectedStudent.gpa).level}
                                            sx={{
                                                bgcolor: getPerformanceLevel(selectedStudent.gpa).color,
                                                color: 'white',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Achievements & Warnings */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        🏆 Thành tích & Cảnh báo
                                    </Typography>
                                    
                                    {selectedStudent.scholarships?.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#4caf50', fontWeight: 600 }}>
                                                💰 Học bổng:
                                            </Typography>
                                            {selectedStudent.scholarships.map((scholarship, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={scholarship}
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    
                                    {selectedStudent.achievements?.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976d2', fontWeight: 600 }}>
                                                🏅 Thành tích:
                                            </Typography>
                                            {selectedStudent.achievements.map((achievement, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={achievement}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    
                                    {selectedStudent.warnings?.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#f44336', fontWeight: 600 }}>
                                                ⚠️ Cảnh báo:
                                            </Typography>
                                            {selectedStudent.warnings.map((warning, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={warning}
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label={selectedStudent.status}
                                            color={selectedStudent.status === 'Đang học' ? 'success' : 'error'}
                                            variant="filled"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDialogOpen(false)}>
                        Đóng
                    </Button>
                    <Button variant="outlined" startIcon={<Edit />}>
                        Chỉnh sửa thông tin
                    </Button>
                    <Button variant="contained" startIcon={<Send />}>
                        Gửi thông báo
                    </Button>
                    <Button variant="contained" color="warning" startIcon={<Feedback />}>
                        Hỗ trợ sinh viên
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClassReport;