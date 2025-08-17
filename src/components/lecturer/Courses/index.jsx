import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Tabs,
    Tab,
    Badge,
    Tooltip,
    Menu,
    MenuList,
    ListItemIcon,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Alert
} from '@mui/material';
import {
    School as SchoolIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    People as PeopleIcon,
    MenuBook as MenuBookIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    MoreVert as MoreVertIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Class as ClassIcon,
    Description as DescriptionIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
    Archive as ArchiveIcon,
    Restore as RestoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
    const navigate = useNavigate();
    
    // States
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Mock data - Môn học mà giảng viên giảng dạy
    const mockCourses = [
        {
            id: 1,
            code: 'IT3040',
            name: 'Lập trình hướng đối tượng',
            englishName: 'Object-Oriented Programming',
            description: 'Môn học giới thiệu các khái niệm cơ bản về lập trình hướng đối tượng, bao gồm đóng gói, kế thừa, đa hình và trừu tượng hóa.',
            credits: 3,
            department: 'Khoa học máy tính',
            category: 'Bắt buộc',
            level: 'Đại học',
            prerequisites: ['IT3020', 'IT3030'],
            status: 'active',
            isStarred: true,
            totalClasses: 8,
            activeClasses: 3,
            totalStudents: 240,
            totalDocuments: 25,
            totalAssignments: 12,
            createdAt: '2023-01-15',
            updatedAt: '2024-08-15'
        },
        {
            id: 2,
            code: 'IT4040',
            name: 'Cấu trúc dữ liệu và giải thuật',
            englishName: 'Data Structures and Algorithms',
            description: 'Môn học cung cấp kiến thức về các cấu trúc dữ liệu cơ bản và các thuật toán xử lý dữ liệu hiệu quả.',
            credits: 4,
            department: 'Khoa học máy tính',
            category: 'Bắt buộc',
            level: 'Đại học',
            prerequisites: ['IT3040'],
            status: 'active',
            isStarred: false,
            totalClasses: 6,
            activeClasses: 2,
            totalStudents: 180,
            totalDocuments: 30,
            totalAssignments: 15,
            createdAt: '2023-02-20',
            updatedAt: '2024-08-10'
        },
        {
            id: 3,
            code: 'IT4050',
            name: 'Cơ sở dữ liệu',
            englishName: 'Database Systems',
            description: 'Môn học giới thiệu các khái niệm cơ bản về hệ quản trị cơ sở dữ liệu, thiết kế và quản lý CSDL.',
            credits: 3,
            department: 'Khoa học máy tính',
            category: 'Bắt buộc',
            level: 'Đại học',
            prerequisites: ['IT3040'],
            status: 'active',
            isStarred: true,
            totalClasses: 5,
            activeClasses: 2,
            totalStudents: 150,
            totalDocuments: 20,
            totalAssignments: 10,
            createdAt: '2023-03-10',
            updatedAt: '2024-08-12'
        },
        {
            id: 4,
            code: 'IT6040',
            name: 'Trí tuệ nhân tạo',
            englishName: 'Artificial Intelligence',
            description: 'Môn học giới thiệu các khái niệm và kỹ thuật cơ bản trong lĩnh vực trí tuệ nhân tạo.',
            credits: 3,
            department: 'Khoa học máy tính',
            category: 'Tự chọn',
            level: 'Đại học',
            prerequisites: ['IT4040', 'IT4050'],
            status: 'active',
            isStarred: false,
            totalClasses: 4,
            activeClasses: 1,
            totalStudents: 120,
            totalDocuments: 18,
            totalAssignments: 8,
            createdAt: '2023-08-15',
            updatedAt: '2024-08-08'
        },
        {
            id: 5,
            code: 'IT3010',
            name: 'Nhập môn lập trình',
            englishName: 'Introduction to Programming',
            description: 'Môn học cơ bản giới thiệu các khái niệm lập trình căn bản và ngôn ngữ lập trình C.',
            credits: 4,
            department: 'Khoa học máy tính',
            category: 'Bắt buộc',
            level: 'Đại học',
            prerequisites: [],
            status: 'archived',
            isStarred: false,
            totalClasses: 12,
            activeClasses: 0,
            totalStudents: 300,
            totalDocuments: 35,
            totalAssignments: 20,
            createdAt: '2022-09-01',
            updatedAt: '2023-12-15'
        },
        {
            id: 6,
            code: 'IT7040',
            name: 'Học máy nâng cao',
            englishName: 'Advanced Machine Learning',
            description: 'Môn học nâng cao về các thuật toán học máy và ứng dụng trong thực tế.',
            credits: 3,
            department: 'Khoa học máy tính',
            category: 'Tự chọn',
            level: 'Thạc sĩ',
            prerequisites: ['IT6040'],
            status: 'draft',
            isStarred: true,
            totalClasses: 0,
            activeClasses: 0,
            totalStudents: 0,
            totalDocuments: 5,
            totalAssignments: 0,
            createdAt: '2024-06-01',
            updatedAt: '2024-08-01'
        }
    ];

    // Filter courses based on tab and filters
    const getFilteredCourses = () => {
        let filtered = mockCourses;

        // Filter by tab
        switch (tabValue) {
            case 0: // All courses
                filtered = filtered.filter(course => course.status !== 'archived');
                break;
            case 1: // Active courses
                filtered = filtered.filter(course => course.status === 'active');
                break;
            case 2: // Starred courses
                filtered = filtered.filter(course => course.isStarred && course.status !== 'archived');
                break;
            case 3: // Draft courses
                filtered = filtered.filter(course => course.status === 'draft');
                break;
            case 4: // Archived courses
                filtered = filtered.filter(course => course.status === 'archived');
                break;
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.englishName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by department
        if (filterDepartment !== 'all') {
            filtered = filtered.filter(course => course.department === filterDepartment);
        }

        return filtered;
    };

    // Statistics
    const stats = {
        total: mockCourses.filter(c => c.status !== 'archived').length,
        active: mockCourses.filter(c => c.status === 'active').length,
        starred: mockCourses.filter(c => c.isStarred && c.status !== 'archived').length,
        draft: mockCourses.filter(c => c.status === 'draft').length,
        archived: mockCourses.filter(c => c.status === 'archived').length,
        totalStudents: mockCourses.reduce((sum, c) => sum + c.totalStudents, 0),
        totalClasses: mockCourses.reduce((sum, c) => sum + c.totalClasses, 0)
    };

    // Load courses
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setCourses(mockCourses);
            setLoading(false);
        }, 1000);
    }, []);

    // Event handlers
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleMenuOpen = (event, course) => {
        setAnchorEl(event.currentTarget);
        setSelectedCourse(course);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCourse(null);
    };

    const handleStarToggle = (courseId) => {
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.id === courseId
                    ? { ...course, isStarred: !course.isStarred }
                    : course
            )
        );
    };

    const handleViewCourse = (course) => {
        navigate(`/lecturer/courses/${course.id}`);
    };

    const handleViewClasses = (course) => {
        navigate(`/lecturer/courses/${course.id}/classes`);
    };

    const handleEditCourse = (course) => {
        console.log('Edit course:', course);
        // Navigate to edit page or open edit dialog
    };

    const handleArchiveCourse = (course) => {
        if (window.confirm(`Bạn có chắc muốn lưu trữ môn học "${course.name}"?`)) {
            setCourses(prevCourses =>
                prevCourses.map(c =>
                    c.id === course.id
                        ? { ...c, status: 'archived' }
                        : c
                )
            );
            handleMenuClose();
        }
    };

    const handleRestoreCourse = (course) => {
        setCourses(prevCourses =>
            prevCourses.map(c =>
                c.id === course.id
                    ? { ...c, status: 'active' }
                    : c
            )
        );
        handleMenuClose();
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'draft': return 'warning';
            case 'archived': return 'default';
            default: return 'default';
        }
    };

    // Get status label
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Đang giảng dạy';
            case 'draft': return 'Bản nháp';
            case 'archived': return 'Đã lưu trữ';
            default: return status;
        }
    };

    // Get category color
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Bắt buộc': return 'error';
            case 'Tự chọn': return 'primary';
            default: return 'default';
        }
    };

    const filteredCourses = getFilteredCourses();

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                {/* <Typography variant="h4" sx={{ mb: 3 }}>Đang tải...</Typography> */}
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    Môn học giảng dạy
                </Typography>
                {/* <Typography variant="body1" color="text.secondary">
                    Quản lý các môn học mà bạn đang giảng dạy
                </Typography> */}
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3} >
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                        {stats.total}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tổng môn học
                                    </Typography>
                                </Box>
                                <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                                        {stats.active}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Đang giảng dạy
                                    </Typography>
                                </Box>
                                <ClassIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                                        {stats.totalStudents}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tổng sinh viên
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                                        {stats.totalClasses}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tổng lớp học
                                    </Typography>
                                </Box>
                                <AnalyticsIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ mb: 3 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Tìm kiếm môn học..."
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
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Khoa/Bộ môn</InputLabel>
                                <Select
                                    value={filterDepartment}
                                    label="Khoa/Bộ môn"
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value="Khoa học máy tính">Khoa học máy tính</MenuItem>
                                    <MenuItem value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</MenuItem>
                                    <MenuItem value="Hệ thống thông tin">Hệ thống thông tin</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterIcon />}
                                    size="small"
                                >
                                    Bộ lọc
                                </Button>
                                {/* <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    size="small"
                                    onClick={() => setCreateDialogOpen(true)}
                                >
                                    Tạo môn học
                                </Button> */}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Tabs */}
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon />
                                Tất cả ({stats.total})
                            </Box>
                        } 
                    />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ClassIcon />
                                Đang dạy ({stats.active})
                            </Box>
                        } 
                    />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StarIcon />
                                Yêu thích ({stats.starred})
                            </Box>
                        } 
                    />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EditIcon />
                                Bản nháp ({stats.draft})
                            </Box>
                        } 
                    />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ArchiveIcon />
                                Lưu trữ ({stats.archived})
                            </Box>
                        } 
                    />
                </Tabs>
            </Paper>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredCourses.map((course) => (
                        <Grid item xs={12} md={6} lg={4} key={course.id} sx={{width: "32%"}}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        elevation: 8,
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                <CardContent sx={{ flex: 1 }}>
                                    {/* Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ flex: 1 }}>
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
                                                    variant="filled"
                                                />
                                            </Box>
                                            <Typography variant="h6" sx={{ 
                                                fontWeight: 600,
                                                lineHeight: 1.3,
                                                mb: 0.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {course.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ 
                                                fontStyle: 'italic',
                                                mb: 1
                                            }}>
                                                {course.englishName}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleStarToggle(course.id)}
                                                color={course.isStarred ? 'warning' : 'default'}
                                            >
                                                {course.isStarred ? <StarIcon /> : <StarBorderIcon />}
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, course)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    {/* Course Info */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                            <Chip
                                                label={`${course.credits} tín chỉ`}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={course.category}
                                                size="small"
                                                color={getCategoryColor(course.category)}
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={course.level}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {course.department}
                                        </Typography>
                                    </Box>

                                    {/* Description */}
                                    <Typography variant="body2" color="text.secondary" sx={{ 
                                        mb: 2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {course.description}
                                    </Typography>

                                    {/* Prerequisites */}
                                    {course.prerequisites.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Môn học tiên quyết:
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {course.prerequisites.map((prereq) => (
                                                    <Chip
                                                        key={prereq}
                                                        label={prereq}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Statistics */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', gap: 3 }}>
                                            <Tooltip title="Lớp học">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ClassIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {course.totalClasses}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                            <Tooltip title="Sinh viên">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {course.totalStudents}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                            <Tooltip title="Tài liệu">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <MenuBookIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {course.totalDocuments}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                            <Tooltip title="Bài tập">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {course.totalAssignments}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </CardContent>

                                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => handleViewCourse(course)}
                                        sx={{ fontSize: '10px' }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ClassIcon />}
                                        onClick={() => handleViewClasses(course)}
                                        sx={{ fontSize: '10px' }}
                                    >
                                        Lớp học ({course.activeClasses})
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditCourse(course)}
                                        sx={{ fontSize: '10px' }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <SchoolIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {searchQuery || filterDepartment !== 'all' ? 'Không tìm thấy môn học nào' : 'Chưa có môn học nào'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchQuery || filterDepartment !== 'all' 
                            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' 
                            : 'Hãy tạo môn học đầu tiên của bạn'
                        }
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        Tạo môn học mới
                    </Button>
                </Box>
            )}

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuList>
                    <MenuItem onClick={() => {
                        handleViewCourse(selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <VisibilityIcon />
                        </ListItemIcon>
                        <ListItemText>Xem chi tiết</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleViewClasses(selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <ClassIcon />
                        </ListItemIcon>
                        <ListItemText>Quản lý lớp học</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleEditCourse(selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText>Chỉnh sửa</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        console.log('Manage documents:', selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <MenuBookIcon />
                        </ListItemIcon>
                        <ListItemText>Quản lý tài liệu</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        console.log('Settings:', selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText>Cài đặt</ListItemText>
                    </MenuItem>
                    <Divider />
                    {selectedCourse?.status === 'archived' ? (
                        <MenuItem onClick={() => handleRestoreCourse(selectedCourse)}>
                            <ListItemIcon>
                                <RestoreIcon />
                            </ListItemIcon>
                            <ListItemText>Khôi phục</ListItemText>
                        </MenuItem>
                    ) : (
                        <MenuItem 
                            onClick={() => handleArchiveCourse(selectedCourse)}
                            sx={{ color: 'error.main' }}
                        >
                            <ListItemIcon>
                                <ArchiveIcon sx={{ color: 'error.main' }} />
                            </ListItemIcon>
                            <ListItemText>Lưu trữ</ListItemText>
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>

            {/* Create Course Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    <AddIcon sx={{ mr: 1 }} />
                    Tạo môn học mới
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Tạo môn học mới để quản lý nội dung giảng dạy. Sau đó bạn có thể tạo các lớp học cụ thể cho từng học kỳ.
                    </Alert>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Mã môn học *"
                                placeholder="VD: IT3040"
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Tên môn học *"
                                placeholder="VD: Lập trình hướng đối tượng"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tên tiếng Anh"
                                placeholder="VD: Object-Oriented Programming"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Số tín chỉ *"
                                defaultValue={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Loại môn học</InputLabel>
                                <Select defaultValue="Bắt buộc" label="Loại môn học">
                                    <MenuItem value="Bắt buộc">Bắt buộc</MenuItem>
                                    <MenuItem value="Tự chọn">Tự chọn</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Bậc học</InputLabel>
                                <Select defaultValue="Đại học" label="Bậc học">
                                    <MenuItem value="Đại học">Đại học</MenuItem>
                                    <MenuItem value="Thạc sĩ">Thạc sĩ</MenuItem>
                                    <MenuItem value="Tiến sĩ">Tiến sĩ</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả môn học"
                                multiline
                                rows={3}
                                placeholder="Mô tả ngắn về nội dung và mục tiêu của môn học..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setCreateDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setCreateDialogOpen(false);
                            alert('Tạo môn học thành công!');
                        }}
                    >
                        Tạo môn học
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Courses;