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
    Alert
} from '@mui/material';
import {
    Analytics,
    Computer,
    Phone,
    Tablet,
    Language,
    AccessTime,
    Visibility,
    TrendingUp,
    TrendingDown,
    LocationOn,
    Schedule,
    Person,
    Group,
    Refresh,
    GetApp,
    FilterList,
    DeviceHub,
    Public,
    Timeline,
    BarChart,
    PieChart as PieChartIcon,
    Speed,
    Update,
    Today,
    CalendarToday,
    Watch,
    DevicesOther,
    Router,
    Browser,
    TouchApp,
    Mouse,
    Dashboard,
    ShowChart,
    Traffic
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
    ComposedChart
} from 'recharts';

const AccessAnalyticsReport = () => {
    // States
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('month');
    const [reportData, setReportData] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState('visits');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Mock data for access analytics
    const mockData = {
        overview: {
            totalVisits: 12847,
            uniqueVisitors: 3562,
            totalPageViews: 45231,
            avgSessionDuration: 8.5, // minutes
            bounceRate: 12.3, // percentage
            newVisitors: 2847,
            returningVisitors: 715
        },
        trends: {
            dailyAccess: [
                { date: '01/11', visits: 420, users: 187, pageViews: 1250, duration: 8.2 },
                { date: '02/11', visits: 380, users: 165, pageViews: 1100, duration: 7.8 },
                { date: '03/11', visits: 510, users: 220, pageViews: 1480, duration: 9.1 },
                { date: '04/11', visits: 445, users: 198, pageViews: 1320, duration: 8.7 },
                { date: '05/11', visits: 620, users: 275, pageViews: 1850, duration: 9.5 },
                { date: '06/11', visits: 580, users: 248, pageViews: 1720, duration: 9.2 },
                { date: '07/11', visits: 395, users: 172, pageViews: 1150, duration: 7.9 }
            ],
            hourlyPattern: [
                { hour: '6h', visits: 45, users: 22 },
                { hour: '7h', visits: 120, users: 65 },
                { hour: '8h', visits: 280, users: 145 },
                { hour: '9h', visits: 420, users: 225 },
                { hour: '10h', visits: 385, users: 198 },
                { hour: '11h', visits: 445, users: 235 },
                { hour: '12h', visits: 320, users: 168 },
                { hour: '13h', visits: 380, users: 195 },
                { hour: '14h', visits: 520, users: 275 },
                { hour: '15h', visits: 485, users: 248 },
                { hour: '16h', visits: 425, users: 218 },
                { hour: '17h', visits: 365, users: 185 },
                { hour: '18h', visits: 285, users: 142 },
                { hour: '19h', visits: 195, users: 98 },
                { hour: '20h', visits: 145, users: 72 },
                { hour: '21h', visits: 85, users: 45 },
                { hour: '22h', visits: 55, users: 28 },
                { hour: '23h', visits: 25, users: 15 }
            ]
        },
        devices: {
            types: [
                { name: 'Desktop', value: 6842, percentage: 53.2, color: '#8884d8' },
                { name: 'Mobile', value: 4285, percentage: 33.4, color: '#82ca9d' },
                { name: 'Tablet', value: 1720, percentage: 13.4, color: '#ffc658' }
            ],
            browsers: [
                { name: 'Chrome', value: 7524, percentage: 58.6, color: '#4285f4' },
                { name: 'Firefox', value: 2568, percentage: 20.0, color: '#ff9500' },
                { name: 'Safari', value: 1542, percentage: 12.0, color: '#000000' },
                { name: 'Edge', value: 963, percentage: 7.5, color: '#0078d4' },
                { name: 'Others', value: 250, percentage: 1.9, color: '#999999' }
            ],
            os: [
                { name: 'Windows', value: 7125, percentage: 55.5, color: '#00bcf2' },
                { name: 'macOS', value: 2568, percentage: 20.0, color: '#000000' },
                { name: 'Android', value: 2051, percentage: 16.0, color: '#3ddc84' },
                { name: 'iOS', value: 897, percentage: 7.0, color: '#007aff' },
                { name: 'Linux', value: 206, percentage: 1.5, color: '#fcc624' }
            ]
        },
        geography: {
            regions: [
                { region: 'Hà Nội', visits: 4285, users: 1542, percentage: 33.4 },
                { region: 'TP. Hồ Chí Minh', visits: 3568, users: 1285, percentage: 27.8 },
                { region: 'Đà Nẵng', visits: 1847, users: 685, percentage: 14.4 },
                { region: 'Hải Phòng', visits: 1125, users: 425, percentage: 8.8 },
                { region: 'Cần Thơ', visits: 897, users: 325, percentage: 7.0 },
                { region: 'Khác', visits: 1125, users: 425, percentage: 8.6 }
            ]
        },
        content: {
            topPages: [
                { page: '/course/java-oop', views: 8524, duration: '12:45', bounce: 8.5 },
                { page: '/documents/lectures', views: 6847, duration: '15:30', bounce: 6.2 },
                { page: '/course/web-development', views: 5236, duration: '18:20', bounce: 5.8 },
                { page: '/assignments/data-structures', views: 4125, duration: '22:15', bounce: 4.2 },
                { page: '/announcements', views: 3687, duration: '5:30', bounce: 15.6 },
                { page: '/course/database-design', views: 3254, duration: '16:45', bounce: 7.1 },
                { page: '/profile/dashboard', views: 2896, duration: '8:20', bounce: 12.3 }
            ]
        },
        performance: {
            loadTimes: [
                { metric: 'Trang chủ', time: 1.2, rating: 'good' },
                { metric: 'Danh sách khóa học', time: 1.8, rating: 'good' },
                { metric: 'Chi tiết môn học', time: 2.1, rating: 'average' },
                { metric: 'Tài liệu', time: 3.5, rating: 'poor' },
                { metric: 'Video bài giảng', time: 4.2, rating: 'poor' },
                { metric: 'Bài tập', time: 1.9, rating: 'good' }
            ]
        },
        realtime: {
            currentUsers: 145,
            currentSessions: 98,
            pageViewsLast30Min: 2847,
            activePages: [
                { page: '/course/java-oop/lesson-5', users: 25 },
                { page: '/documents/react-tutorial', users: 18 },
                { page: '/assignments/submit', users: 15 },
                { page: '/course/database/quiz', users: 12 },
                { page: '/announcements/urgent', users: 8 }
            ]
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setReportData(mockData);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const getPerformanceColor = (rating) => {
        switch (rating) {
            case 'good': return '#4caf50';
            case 'average': return '#ff9800';
            case 'poor': return '#f44336';
            default: return '#666';
        }
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
                    Đang tải thống kê truy cập...
                </Typography>
            </Box>
        );
    }

    return (
        // <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        //     {/* Header */}
        //     <Box sx={{ mb: 4 }}>
        //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        //             <Box>
        //                 <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
        //                     📈 Thống kê Truy cập
        //                 </Typography>
        //                 <Typography variant="subtitle1" color="text.secondary">
        //                     Phân tích chi tiết lưu lượng truy cập và hành vi người dùng
        //                 </Typography>
        //             </Box>
                    
        //             <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        //                 <FormControl size="small" sx={{ minWidth: 150 }}>
        //                     <InputLabel>Khoảng thời gian</InputLabel>
        //                     <Select
        //                         value={timeRange}
        //                         label="Khoảng thời gian"
        //                         onChange={handleTimeRangeChange}
        //                     >
        //                         <MenuItem value="today">Hôm nay</MenuItem>
        //                         <MenuItem value="week">7 ngày qua</MenuItem>
        //                         <MenuItem value="month">30 ngày qua</MenuItem>
        //                         <MenuItem value="quarter">3 tháng qua</MenuItem>
        //                         <MenuItem value="year">Năm nay</MenuItem>
        //                     </Select>
        //                 </FormControl>
                        
        //                 <Button
        //                     variant="outlined"
        //                     startIcon={<Refresh />}
        //                     onClick={fetchAnalyticsData}
        //                     sx={{ whiteSpace: 'nowrap' }}
        //                 >
        //                     Làm mới
        //                 </Button>
                        
        //                 <Button
        //                     variant="contained"
        //                     startIcon={<GetApp />}
        //                     sx={{ 
        //                         background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        //                         whiteSpace: 'nowrap'
        //                     }}
        //                 >
        //                     Xuất báo cáo
        //                 </Button>
        //             </Box>
        //         </Box>

        //         {/* Real-time Stats Alert */}
        //         <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        //                     <Badge color="success" variant="dot">
        //                         <Person />
        //                     </Badge>
        //                     <Typography variant="body2">
        //                         <strong>{reportData?.realtime.currentUsers}</strong> người dùng đang trực tuyến
        //                     </Typography>
        //                 </Box>
        //                 <Divider orientation="vertical" flexItem />
        //                 <Typography variant="body2">
        //                     <strong>{reportData?.realtime.pageViewsLast30Min}</strong> lượt xem trong 30 phút qua
        //                 </Typography>
        //             </Box>
        //         </Alert>

        //         {/* Overview Stats Cards */}
        //         <Grid container spacing={3} sx={{ mb: 4 }}>
        //             <Grid item xs={12} sm={6} md={3} sx={{ width: '18%' }}>
        //                 <StatCard
        //                     icon={<Visibility />}
        //                     title="Lượt truy cập"
        //                     value={reportData?.overview.totalVisits.toLocaleString() || 0}
        //                     subtitle="Tổng số phiên làm việc"
        //                     trend={15.3}
        //                     gradientColors={['#667eea', '#764ba2']}
        //                 />
        //             </Grid>
        //             <Grid item xs={12} sm={6} md={3} sx={{ width: '18%' }}>
        //                 <StatCard
        //                     icon={<Group />}
        //                     title="Người dùng"
        //                     value={reportData?.overview.uniqueVisitors.toLocaleString() || 0}
        //                     subtitle="Người dùng duy nhất"
        //                     trend={8.7}
        //                     gradientColors={['#f093fb', '#f5576c']}
        //                 />
        //             </Grid>
        //             <Grid item xs={12} sm={6} md={3} sx={{ width: '18%' }}>
        //                 <StatCard
        //                     icon={<Analytics />}
        //                     title="Lượt xem trang"
        //                     value={reportData?.overview.totalPageViews.toLocaleString() || 0}
        //                     subtitle="Tổng số trang được xem"
        //                     trend={12.5}
        //                     gradientColors={['#4facfe', '#00f2fe']}
        //                 />
        //             </Grid>
        //             <Grid item xs={12} sm={6} md={3} sx={{ width: '18%' }}>
        //                 <StatCard
        //                     icon={<AccessTime />}
        //                     title="Thời gian TB"
        //                     value={`${reportData?.overview.avgSessionDuration}p` || '0p'}
        //                     subtitle="Trung bình mỗi phiên"
        //                     trend={-2.1}
        //                     gradientColors={['#43e97b', '#38f9d7']}
        //                 />
        //             </Grid>
        //             <Grid item xs={12} sm={6} md={3} sx={{ width: '18%' }}>
        //                 <StatCard
        //                     icon={<TrendingUp />}
        //                     title="Tỷ lệ thoát"
        //                     value={`${reportData?.overview.bounceRate}%` || '0%'}
        //                     subtitle="Người dùng rời ngay"
        //                     trend={-5.4}
        //                     gradientColors={['#fa709a', '#fee140']}
        //                 />
        //             </Grid>
        //         </Grid>
        //     </Box>

        //     {/* Traffic Analysis Charts */}
        //     <Grid container spacing={3} sx={{ mb: 4 }}>
        //         {/* Daily Traffic Trend */}
        //         <Grid item xs={12} lg={8} sx={{ width: '65%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Xu hướng truy cập theo ngày"
        //                     subheader="Biểu đồ lưu lượng truy cập hàng ngày"
        //                     avatar={<ShowChart color="primary" />}
        //                 />
        //                 <CardContent>
        //                     <ResponsiveContainer width="100%" height={400}>
        //                         <ComposedChart data={reportData?.trends.dailyAccess || []}>
        //                             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        //                             <XAxis dataKey="date" stroke="#666" />
        //                             <YAxis yAxisId="left" stroke="#666" />
        //                             <YAxis yAxisId="right" orientation="right" stroke="#666" />
        //                             <RechartsTooltip 
        //                                 contentStyle={{ 
        //                                     backgroundColor: 'white', 
        //                                     border: '1px solid #e0e0e0',
        //                                     borderRadius: '8px',
        //                                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        //                                 }} 
        //                             />
        //                             <Legend />
        //                             <Area yAxisId="left" type="monotone" dataKey="visits" fill="#8884d8" fillOpacity={0.6} stroke="#8884d8" name="Lượt truy cập" />
        //                             <Bar yAxisId="left" dataKey="users" fill="#82ca9d" name="Người dùng" />
        //                             <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#ff7300" strokeWidth={3} name="Thời gian (phút)" />
        //                         </ComposedChart>
        //                     </ResponsiveContainer>
        //                 </CardContent>
        //             </Card>
        //         </Grid>

        //         {/* Hourly Pattern */}
        //         <Grid item xs={12} lg={4} sx={{ width: '35%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Phân bố theo giờ"
        //                     subheader="Lưu lượng trong ngày"
        //                     avatar={<Schedule color="success" />}
        //                 />
        //                 <CardContent>
        //                     <ResponsiveContainer width="100%" height={400}>
        //                         <AreaChart data={reportData?.trends.hourlyPattern || []}>
        //                             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        //                             <XAxis dataKey="hour" stroke="#666" />
        //                             <YAxis stroke="#666" />
        //                             <RechartsTooltip />
        //                             <Area type="monotone" dataKey="visits" stackId="1" stroke="#1976d2" fill="#1976d2" fillOpacity={0.8} />
        //                         </AreaChart>
        //                     </ResponsiveContainer>
        //                 </CardContent>
        //             </Card>
        //         </Grid>
        //     </Grid>

        //     {/* Device & Browser Analytics */}
        //     <Grid container spacing={3} sx={{ mb: 4 }}>
        //         {/* Device Types */}
        //         <Grid item xs={12} md={4} sx={{ width: '31%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Thiết bị truy cập"
        //                     subheader="Phân bố theo loại thiết bị"
        //                     avatar={<DeviceHub color="primary" />}
        //                 />
        //                 <CardContent>
        //                     <ResponsiveContainer width="100%" height={300}>
        //                         <PieChart>
        //                             <Pie
        //                                 data={reportData?.devices.types || []}
        //                                 cx="50%"
        //                                 cy="50%"
        //                                 outerRadius={80}
        //                                 fill="#8884d8"
        //                                 dataKey="value"
        //                                 label={({ name, percentage }) => `${name}: ${percentage}%`}
        //                             >
        //                                 {reportData?.devices.types.map((entry, index) => (
        //                                     <Cell key={`cell-${index}`} fill={entry.color} />
        //                                 ))}
        //                             </Pie>
        //                             <RechartsTooltip />
        //                         </PieChart>
        //                     </ResponsiveContainer>
                            
        //                     {/* Device details */}
        //                     <Box sx={{ mt: 2 }}>
        //                         {reportData?.devices.types.map((device, index) => (
        //                             <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        //                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
        //                                     <Box sx={{ width: 12, height: 12, bgcolor: device.color, borderRadius: '50%', mr: 1 }} />
        //                                     <Typography variant="body2">{device.name}</Typography>
        //                                 </Box>
        //                                 <Typography variant="body2" sx={{ fontWeight: 600 }}>
        //                                     {device.value.toLocaleString()}
        //                                 </Typography>
        //                             </Box>
        //                         ))}
        //                     </Box>
        //                 </CardContent>
        //             </Card>
        //         </Grid>

        //         {/* Browsers */}
        //         <Grid item xs={12} md={4} sx={{ width: '31%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Trình duyệt"
        //                     subheader="Phân bố theo browser"
        //                     avatar={<Language color="warning" />}
        //                 />
        //                 <CardContent>
        //                     <ResponsiveContainer width="100%" height={300}>
        //                         <RechartsBarChart data={reportData?.devices.browsers || []}>
        //                             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        //                             <XAxis dataKey="name" stroke="#666" />
        //                             <YAxis stroke="#666" />
        //                             <RechartsTooltip />
        //                             <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        //                         </RechartsBarChart>
        //                     </ResponsiveContainer>
        //                 </CardContent>
        //             </Card>
        //         </Grid>

        //         {/* Operating Systems */}
        //         <Grid item xs={12} md={4} sx={{ width: '31%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Hệ điều hành"
        //                     subheader="Phân bố theo OS"
        //                     avatar={<Computer color="info" />}
        //                 />
        //                 <CardContent>
        //                     <ResponsiveContainer width="100%" height={300}>
        //                         <PieChart>
        //                             <Pie
        //                                 data={reportData?.devices.os || []}
        //                                 cx="50%"
        //                                 cy="50%"
        //                                 innerRadius={40}
        //                                 outerRadius={80}
        //                                 fill="#ffc658"
        //                                 dataKey="value"
        //                                 label={({ name, percentage }) => `${name}: ${percentage}%`}
        //                             >
        //                                 {reportData?.devices.os.map((entry, index) => (
        //                                     <Cell key={`cell-${index}`} fill={entry.color} />
        //                                 ))}
        //                             </Pie>
        //                             <RechartsTooltip />
        //                         </PieChart>
        //                     </ResponsiveContainer>
        //                 </CardContent>
        //             </Card>
        //         </Grid>
        //     </Grid>

        //     {/* Content & Performance Analytics */}
        //     <Grid container spacing={3} sx={{ mb: 4 }}>
        //         {/* Top Pages */}
        //         <Grid item xs={12} lg={8} sx={{ width: '65%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Trang được truy cập nhiều nhất"
        //                     subheader="Thống kê lượt xem theo trang"
        //                     avatar={<Traffic color="primary" />}
        //                 />
        //                 <CardContent>
        //                     <TableContainer>
        //                         <Table>
        //                             <TableHead>
        //                                 <TableRow>
        //                                     <TableCell><strong>Đường dẫn</strong></TableCell>
        //                                     <TableCell align="right"><strong>Lượt xem</strong></TableCell>
        //                                     <TableCell align="right"><strong>Thời gian TB</strong></TableCell>
        //                                     <TableCell align="right"><strong>Tỷ lệ thoát</strong></TableCell>
        //                                 </TableRow>
        //                             </TableHead>
        //                             <TableBody>
        //                                 {reportData?.content.topPages.map((page, index) => (
        //                                     <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}>
        //                                         <TableCell>
        //                                             <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
        //                                                 {page.page}
        //                                             </Typography>
        //                                         </TableCell>
        //                                         <TableCell align="right">
        //                                             <Typography variant="body2" sx={{ fontWeight: 600 }}>
        //                                                 {page.views.toLocaleString()}
        //                                             </Typography>
        //                                         </TableCell>
        //                                         <TableCell align="right">
        //                                             <Typography variant="body2">
        //                                                 {page.duration}
        //                                             </Typography>
        //                                         </TableCell>
        //                                         <TableCell align="right">
        //                                             <Chip
        //                                                 label={`${page.bounce}%`}
        //                                                 size="small"
        //                                                 color={page.bounce < 10 ? 'success' : page.bounce < 20 ? 'warning' : 'error'}
        //                                                 variant="outlined"
        //                                             />
        //                                         </TableCell>
        //                                     </TableRow>
        //                                 ))}
        //                             </TableBody>
        //                         </Table>
        //                     </TableContainer>
        //                 </CardContent>
        //             </Card>
        //         </Grid>

        //         {/* Performance Metrics */}
        //         <Grid item xs={12} lg={4} sx={{ width: '35%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Hiệu suất trang"
        //                     subheader="Thời gian tải trang"
        //                     avatar={<Speed color="error" />}
        //                 />
        //                 <CardContent>
        //                     {reportData?.performance.loadTimes.map((item, index) => (
        //                         <Box key={index} sx={{ mb: 3 }}>
        //                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        //                                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
        //                                     {item.metric}
        //                                 </Typography>
        //                                 <Chip
        //                                     label={`${item.time}s`}
        //                                     size="small"
        //                                     sx={{
        //                                         bgcolor: getPerformanceColor(item.rating),
        //                                         color: 'white',
        //                                         fontWeight: 600
        //                                     }}
        //                                 />
        //                             </Box>
        //                             <LinearProgress
        //                                 variant="determinate"
        //                                 value={Math.min((item.time / 5) * 100, 100)}
        //                                 sx={{
        //                                     height: 8,
        //                                     borderRadius: 4,
        //                                     bgcolor: '#f0f0f0',
        //                                     '& .MuiLinearProgress-bar': {
        //                                         bgcolor: getPerformanceColor(item.rating)
        //                                     }
        //                                 }}
        //                             />
        //                         </Box>
        //                     ))}
        //                 </CardContent>
        //             </Card>
        //         </Grid>
        //     </Grid>

        //     {/* Geographic & Real-time Data */}
        //     <Grid container spacing={3}>
        //         {/* Geographic Distribution */}
        //         <Grid item xs={12} lg={6} sx={{ width: '48%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Phân bố địa lý"
        //                     subheader="Truy cập theo khu vực"
        //                     avatar={<LocationOn color="primary" />}
        //                 />
        //                 <CardContent>
        //                     {reportData?.geography.regions.map((region, index) => (
        //                         <Box key={index} sx={{ mb: 2 }}>
        //                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        //                                 <Typography variant="body1" sx={{ fontWeight: 500 }}>
        //                                     {region.region}
        //                                 </Typography>
        //                                 <Typography variant="body2" sx={{ fontWeight: 600 }}>
        //                                     {region.visits.toLocaleString()} ({region.percentage}%)
        //                                 </Typography>
        //                             </Box>
        //                             <LinearProgress
        //                                 variant="determinate"
        //                                 value={region.percentage}
        //                                 sx={{
        //                                     height: 8,
        //                                     borderRadius: 4,
        //                                     bgcolor: '#f0f0f0',
        //                                     '& .MuiLinearProgress-bar': {
        //                                         bgcolor: `hsl(${index * 60}, 70%, 50%)`
        //                                     }
        //                                 }}
        //                             />
        //                         </Box>
        //                     ))}
        //                 </CardContent>
        //             </Card>
        //         </Grid>

        //         {/* Real-time Active Pages */}
        //         <Grid item xs={12} lg={6} sx={{ width: '48%' }}>
        //             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        //                 <CardHeader 
        //                     title="Trang đang hoạt động"
        //                     subheader="Người dùng đang xem thời gian thực"
        //                     avatar={<Badge color="success" variant="dot"><Dashboard color="success" /></Badge>}
        //                 />
        //                 <CardContent>
        //                     <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
        //                         <Typography variant="body2">
        //                             <strong>{reportData?.realtime.currentSessions}</strong> phiên đang hoạt động
        //                         </Typography>
        //                     </Alert>
                            
        //                     {reportData?.realtime.activePages.map((page, index) => (
        //                         <Box key={index} sx={{ 
        //                             display: 'flex', 
        //                             justifyContent: 'space-between', 
        //                             alignItems: 'center',
        //                             p: 2,
        //                             mb: 1,
        //                             bgcolor: '#f8f9fa',
        //                             borderRadius: 2,
        //                             border: '1px solid #e0e0e0'
        //                         }}>
        //                             <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>
        //                                 {page.page}
        //                             </Typography>
        //                             <Badge badgeContent={page.users} color="primary" max={999}>
        //                                 <Person />
        //                             </Badge>
        //                         </Box>
        //                     ))}
        //                 </CardContent>
        //             </Card>
        //         </Grid>
        //     </Grid>
        // </Box>
        <></>
    );
};

export default AccessAnalyticsReport;