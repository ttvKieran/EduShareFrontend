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
    Badge
} from '@mui/material';
import {
    Assessment,
    School,
    PeopleAlt,
    LibraryBooks,
    Announcement,
    TrendingUp,
    TrendingDown,
    Visibility,
    Download,
    CloudUpload,
    Assignment,
    Grade,
    Refresh,
    GetApp,
    Class,
    Timeline,
    BarChart,
    DonutLarge,
    ShowChart,
    InsertChart,
    Category,
    FilePresent,
    Description,
    Quiz,
    Book as BookOpen,
    NotificationsActive,
    Groups,
    BookmarkBorder,
    Folder,
    Speaker,
    Campaign
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const TeachingActivityReport = () => {
    // States
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('month');
    const [reportData, setReportData] = useState(null);

    // Enhanced Mock data
    const mockData = {
        overview: {
            totalCourses: 8,
            totalClasses: 12,
            // totalStudents: 287,
            totalDocuments: 45,
            totalAnnouncements: 23
        },
        trends: {
            weeklyActivity: [
                { week: 'T1', courses: 6, classes: 8, students: 120, documents: 5 },
                { week: 'T2', courses: 7, classes: 10, students: 145, documents: 8 },
                { week: 'T3', courses: 8, classes: 12, students: 160, documents: 6 },
                { week: 'T4', courses: 8, classes: 15, students: 180, documents: 9 },
                { week: 'T5', courses: 8, classes: 14, students: 175, documents: 7 },
                { week: 'T6', courses: 8, classes: 16, students: 195, documents: 10 }
            ],
            monthlyComparison: [
                { month: 'T6', current: 156, previous: 134 },
                { month: 'T7', current: 178, previous: 156 },
                { month: 'T8', current: 195, previous: 178 },
                { month: 'T9', current: 210, previous: 195 }
            ]
        },
        documents: {
            byType: [
                { name: 'Bài giảng', value: 18, color: '#8884d8' },
                { name: 'Bài tập', value: 12, color: '#82ca9d' },
                { name: 'Tài liệu tham khảo', value: 8, color: '#ffc658' },
                { name: 'Đề thi', value: 4, color: '#ff7300' },
                { name: 'Giáo trình', value: 3, color: '#0088fe' }
            ],
            topDownloaded: [
                { name: 'Java OOP Fundamentals', downloads: 156, course: 'Lập trình hướng đối tượng', type: 'lecture' },
                { name: 'Data Structures Exercise', downloads: 134, course: 'Cấu trúc dữ liệu', type: 'exercise' },
                { name: 'React Tutorial', downloads: 128, course: 'Phát triển Web', type: 'reference' },
                { name: 'Algorithm Practice', downloads: 98, course: 'Giải thuật', type: 'exercise' },
                { name: 'Database Design Guide', downloads: 87, course: 'Cơ sở dữ liệu', type: 'curriculum' }
            ],
            uploadTrend: [
                { month: 'T6', uploads: 8 },
                { month: 'T7', uploads: 12 },
                { month: 'T8', uploads: 15 },
                { month: 'T9', uploads: 10 }
            ]
        },
        courses: {
            performance: [
                { name: 'Lập trình Java', students: 45, documents: 12, announcements: 8, engagement: 85 },
                { name: 'Cấu trúc dữ liệu', students: 38, documents: 15, announcements: 5, engagement: 78 },
                { name: 'Phát triển Web', students: 52, documents: 18, announcements: 10, engagement: 92 },
                { name: 'Cơ sở dữ liệu', students: 41, documents: 8, announcements: 6, engagement: 71 },
                { name: 'Mạng máy tính', students: 35, documents: 10, announcements: 4, engagement: 68 }
            ]
        },
        classes: {
            distribution: [
                { semester: 'HK1', classes: 6, students: 168 },
                { semester: 'HK2', classes: 6, students: 119 }
            ],
            activeClasses: [
                { name: 'Java OOP - K18A', students: 45, status: 'active', progress: 75 },
                { name: 'Web Dev - K18B', students: 38, status: 'active', progress: 68 },
                { name: 'Database - K17A', students: 41, status: 'active', progress: 82 },
                { name: 'Network - K17B', students: 35, status: 'active', progress: 45 }
            ]
        },
        announcements: {
            byPriority: [
                { name: 'Cao', value: 5, color: '#ff4444' },
                { name: 'Thường', value: 15, color: '#44aa44' },
                { name: 'Thấp', value: 3, color: '#4488ff' }
            ],
            byType: [
                { name: 'Thông báo chung', value: 8, color: '#8884d8' },
                { name: 'Bài tập', value: 6, color: '#82ca9d' },
                { name: 'Thi cử', value: 4, color: '#ffc658' },
                { name: 'Lịch học', value: 3, color: '#ff7300' },
                { name: 'Khẩn cấp', value: 2, color: '#ff4444' }
            ],
            recent: [
                { title: 'Thông báo nghỉ học ngày 15/11', course: 'Lập trình Java', time: '2 giờ trước', priority: 'cao' },
                { title: 'Nộp bài tập tuần 8', course: 'Phát triển Web', time: '5 giờ trước', priority: 'thường' },
                { title: 'Lịch thi giữa kỳ', course: 'Cơ sở dữ liệu', time: '1 ngày trước', priority: 'cao' },
                { title: 'Tài liệu bổ sung chương 5', course: 'Mạng máy tính', time: '2 ngày trước', priority: 'thấp' }
            ]
        },
        recentActivities: [
            {
                id: 1,
                type: 'document',
                title: 'Đã upload tài liệu "React Fundamentals"',
                course: 'Phát triển ứng dụng Web',
                time: '30 phút trước'
            },
            {
                id: 2,
                type: 'announcement',
                title: 'Gửi thông báo về bài kiểm tra giữa kỳ',
                course: 'Lập trình hướng đối tượng',
                time: '2 giờ trước'
            },
            {
                id: 3,
                type: 'grade',
                title: 'Đã chấm 25 bài tập về nhà',
                course: 'Cấu trúc dữ liệu',
                time: '4 giờ trước'
            },
            {
                id: 4,
                type: 'class',
                title: 'Tạo lớp học mới "Database Design K18"',
                course: 'Cơ sở dữ liệu',
                time: '1 ngày trước'
            }
        ]
    };

    useEffect(() => {
        fetchReportData();
    }, [timeRange]);

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

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'document': return <LibraryBooks color="primary" />;
            case 'announcement': return <Announcement color="warning" />;
            case 'grade': return <Grade color="success" />;
            case 'class': return <Class color="info" />;
            default: return <Assignment />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'document': return '#e3f2fd';
            case 'announcement': return '#fff3e0';
            case 'grade': return '#e8f5e8';
            case 'class': return '#f3e5f5';
            default: return '#f5f5f5';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'cao': return '#ff4444';
            case 'thường': return '#44aa44';
            case 'thấp': return '#4488ff';
            default: return '#666';
        }
    };

    const StatCard = ({ icon, title, value, subtitle, trend, color = 'primary', gradientColors = ['#667eea', '#764ba2'] }) => (
        <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`, 
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '260px',
            minWidth: '220px'
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
                                // bgcolor: trend > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                color: trend > 0 ? '#4caf50' : '#f44336',
                                fontWeight: 600,
                                backgroundColor: 'white'
                            }}
                        />
                    )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
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

    const ActivityItem = ({ activity }) => (
        <ListItem sx={{ bgcolor: getActivityColor(activity.type), borderRadius: 2, mb: 1.5, border: '1px solid #e0e0e0' }}>
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'white', color: 'primary.main', boxShadow: 2 }}>
                    {getActivityIcon(activity.type)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {activity.title}
                    </Typography>
                }
                secondary={
                    <Box>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                            {activity.course}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {activity.time}
                        </Typography>
                    </Box>
                }
            />
        </ListItem>
    );

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Đang tải báo cáo...
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
                            Báo cáo Hoạt động Giảng dạy
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Tổng quan và thống kê chi tiết hoạt động giảng dạy của bạn
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Khoảng thời gian</InputLabel>
                            <Select
                                value={timeRange}
                                label="Khoảng thời gian"
                                onChange={handleTimeRangeChange}
                            >
                                <MenuItem value="week">Tuần này</MenuItem>
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

                {/* Enhanced Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'space-evenly' }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<BookOpen />}
                            title="Môn học"
                            value={reportData?.overview.totalCourses || 0}
                            subtitle="Đang phụ trách"
                            trend={8}
                            gradientColors={['#667eea', '#764ba2']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            icon={<Class />}
                            title="Lớp học"
                            value={reportData?.overview.totalClasses || 0}
                            subtitle="Đang giảng dạy"
                            trend={5}
                            gradientColors={['#f093fb', '#f5576c']}
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={6} md={2.4} sx={{width: '18%'}}>
                        <StatCard
                            icon={<PeopleAlt />}
                            title="Sinh viên"
                            value={reportData?.overview.totalStudents || 0}
                            subtitle="Tổng số học viên"
                            trend={12}
                            gradientColors={['#4facfe', '#00f2fe']}
                        />
                    </Grid> */}
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            icon={<LibraryBooks />}
                            title="Tài liệu"
                            value={reportData?.overview.totalDocuments || 0}
                            subtitle="Đã tải lên"
                            trend={-3}
                            gradientColors={['#43e97b', '#38f9d7']}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4} >
                        <StatCard
                            icon={<NotificationsActive />}
                            title="Thông báo"
                            value={reportData?.overview.totalAnnouncements || 0}
                            subtitle="Đã gửi"
                            trend={15}
                            gradientColors={['#fa709a', '#fee140']}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 0 }}>
                {/* Weekly Activity Chart */}
                {/* <Grid item xs={12} lg={8} sx={{width: '47%'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Hoạt động giảng dạy theo tuần"
                            subheader="Biểu đồ thống kê hoạt động hàng tuần"
                            avatar={<BarChart color="primary" />}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={reportData?.trends.weeklyActivity || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="week" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <RechartsTooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }} 
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="courses" stackId="1" stroke="#667eea" fill="#667eea" fillOpacity={0.8} name="Môn học" />
                                    <Area type="monotone" dataKey="classes" stackId="2" stroke="#1976d2" fill="#1976d2" fillOpacity={0.8} name="Lớp học" />
                                    <Area type="monotone" dataKey="documents" stackId="3" stroke="#4caf50" fill="#4caf50" fillOpacity={0.8} name="Tài liệu" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid> */}

                {/* Monthly Comparison */}
                {/* <Grid item xs={12} lg={4} sx={{width: '47%'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="So sánh theo tháng"
                            subheader="Xu hướng phát triển"
                            avatar={<Timeline color="success" />}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <RechartsBarChart data={reportData?.trends.monthlyComparison || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Bar dataKey="previous" fill="#e0e0e0" name="Tháng trước" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="current" fill="#1976d2" name="Tháng này" radius={[4, 4, 0, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>

            {/* Document & Announcement Analytics */}
            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'space-evenly'}}>
                {/* Document Type Distribution */}
                <Grid item xs={12} md={4} sx={{minWidth: '560px'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Phân loại tài liệu"
                            subheader="Theo loại nội dung"
                            avatar={<Folder color="primary" />}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={reportData?.documents.byType || []}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {reportData?.documents.byType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Announcement Types */}
                <Grid item xs={12} md={4} sx={{minWidth: '560px'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Loại thông báo"
                            subheader="Phân bổ theo mục đích"
                            avatar={<Campaign color="warning" />}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={reportData?.announcements.byType || []}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#82ca9d"
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {reportData?.announcements.byType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Course Performance */}
                {/* <Grid item xs={12} md={4} sx={{width: '31%'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Hiệu suất môn học"
                            subheader="Mức độ tương tác sinh viên"
                            avatar={<Assessment color="success" />}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsBarChart data={reportData?.courses.performance || []} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <RechartsTooltip />
                                    <Bar dataKey="engagement" fill="#8884d8" radius={[0, 4, 4, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>

            {/* Detail Information */}
            <Grid container spacing={3} sx={{justifyContent: 'space-evenly'}}>
                {/* Top Downloaded Documents */}
                <Grid item xs={12} lg={6} sx={{minWidth: '700px'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }} >
                        <CardHeader 
                            title="Tài liệu được tải nhiều nhất"
                            subheader="Top 5 tài liệu phổ biến"
                            avatar={<Download color="primary" />}
                        />
                        <CardContent sx={{ maxHeight: 400, overflowY: 'auto' }}>
                            {reportData?.documents.topDownloaded.map((doc, index) => (
                                <Box key={index} sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    p: 2, 
                                    mb: 1,
                                    bgcolor: index === 0 ? '#fff3e0' : '#f8f9fa',
                                    borderRadius: 2,
                                    border: index === 0 ? '2px solid #ff9800' : '1px solid #e0e0e0'
                                }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {index + 1}. {doc.name}
                                        </Typography>
                                        <Typography variant="body2" color="primary" sx={{ mb: 0.5 }}>
                                            {doc.course}
                                        </Typography>
                                        <Chip 
                                            label={doc.type} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                            {doc.downloads}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            lượt tải
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6} sx={{minWidth: '430px'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Thông báo gần đây"
                            subheader="Các thông báo mới nhất"
                            avatar={<Speaker color="warning" />}
                        />
                        <CardContent sx={{ maxHeight: 400, overflowY: 'auto' }}>
                            {reportData?.announcements.recent.map((announcement, index) => (
                                <Box key={index} sx={{ 
                                    p: 2, 
                                    mb: 2, 
                                    borderRadius: 2, 
                                    border: '1px solid #e0e0e0',
                                    bgcolor: '#fafafa'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                                            {announcement.title}
                                        </Typography>
                                        <Chip 
                                            label={announcement.priority.toUpperCase()} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: getPriorityColor(announcement.priority),
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="primary" sx={{ mb: 0.5 }}>
                                        {announcement.course}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {announcement.time}
                                    </Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activities */}
                {/* <Grid item xs={12} lg={6} sx={{width: '60%'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Hoạt động gần đây"
                            subheader="Các hoạt động mới nhất của bạn"
                            avatar={<Timeline color="primary" />}
                        />
                        <CardContent sx={{ maxHeight: 400, overflowY: 'auto' }}>
                            <List disablePadding>
                                {reportData?.recentActivities.map((activity, index) => (
                                    <ActivityItem key={index} activity={activity} />
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>

            {/* Class and Announcement Details */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Active Classes */}
                {/* <Grid item xs={12} lg={6} sx={{width: '34%'}}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardHeader 
                            title="Lớp học đang hoạt động"
                            subheader="Danh sách lớp và tiến độ"
                            avatar={<Groups color="info" />}
                        />
                        <CardContent>
                            {reportData?.classes.activeClasses.map((cls, index) => (
                                <Box key={index} sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {cls.name}
                                        </Typography>
                                        <Chip 
                                            label={`${cls.students} SV`} 
                                            size="small" 
                                            color="primary" 
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Tiến độ học tập</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {cls.progress}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={cls.progress} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4,
                                            bgcolor: '#f0f0f0',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: cls.progress > 75 ? '#4caf50' : cls.progress > 50 ? '#ff9800' : '#f44336'
                                            }
                                        }}
                                    />
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid> */}

                {/* Recent Announcements */}
                
            </Grid>
        </Box>
    );
};

export default TeachingActivityReport;