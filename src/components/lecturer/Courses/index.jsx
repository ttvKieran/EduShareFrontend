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
    Alert,
    Skeleton
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
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import API_BASE_URL from '../../../configs/system';

const Courses = () => {
    const navigate = useNavigate();
    const { authenticatedFetch } = useAuth();
    
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
    const [error, setError] = useState(null);

    // Fetch courses from API
    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/courses/`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data);
                
                // Transform API data to match component format
                const transformedCourses = data.data.map((courseArray) => {
                    const [courseId, courseData] = courseArray;
                    
                    return {
                        id: courseData._id,
                        code: courseData.code || 'N/A',
                        name: courseData.name,
                        englishName: '', // API không có field này
                        description: courseData.description,
                        credits: courseData.credits,
                        department: courseData.departmentId?.name || 'N/A',
                        category: courseData.courseType || 'N/A',
                        level: 'Đại học', // API không có field này, set mặc định
                        prerequisites: courseData.prerequisites?.map(p => p.code) || [],
                        status: 'active', // Mặc định active vì API trả về courses của lecturer
                        isStarred: false, // Sẽ implement sau
                        totalClasses: courseData.classIds?.length || 0,
                        activeClasses: courseData.classIds?.filter(c => c.status === 'active').length || 0,
                        totalStudents: 0, // Sẽ tính từ classIds
                        totalDocuments: courseData.documentIds?.length || 0,
                        totalAssignments: 0, // API chưa có field này
                        createdAt: courseData.createdAt,
                        updatedAt: courseData.updatedAt,
                        maxStudents: courseData.maxStudents || 0,
                        classIds: courseData.classIds || []
                    };
                });
                
                setCourses(transformedCourses);
            } else {
                throw new Error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Không thể tải danh sách môn học. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Load courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Get unique departments for filter
    const getDepartments = () => {
        const departments = [...new Set(courses.map(course => course.department))];
        return departments.filter(dept => dept !== 'N/A');
    };

    // Filter courses based on tab and filters
    const getFilteredCourses = () => {
        let filtered = courses;

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
                course.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        total: courses.filter(c => c.status !== 'archived').length,
        active: courses.filter(c => c.status === 'active').length,
        starred: courses.filter(c => c.isStarred && c.status !== 'archived').length,
        draft: courses.filter(c => c.status === 'draft').length,
        archived: courses.filter(c => c.status === 'archived').length,
        totalStudents: courses.reduce((sum, c) => sum + c.totalStudents, 0),
        totalClasses: courses.reduce((sum, c) => sum + c.totalClasses, 0)
    };

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
        // Navigate to course detail page
        navigate(`/lecturer/courses/${course.id}`);
    };

    const handleViewClasses = (course) => {
        // Navigate to classes page with course filter
        navigate(`/lecturer/classes/classesOfCourse/${course.id}`, { state: { courseFilter: course.id } });
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
            case 'Cơ sở ngành': return 'primary';
            case 'Chuyên ngành': return 'secondary';
            case 'Tự chọn': return 'info';
            default: return 'default';
        }
    };

    const filteredCourses = getFilteredCourses();

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                    Môn học giảng dạy
                </Typography>
                
                {/* Loading Statistics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} md={3} key={item}>
                            <Card>
                                <CardContent>
                                    <Skeleton variant="text" width="60%" height={32} />
                                    <Skeleton variant="text" width="40%" height={20} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Loading Filters */}
                <Paper sx={{ mb: 3, p: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} />
                </Paper>

                {/* Loading Course Cards */}
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item xs={12} md={6} lg={4} key={item}>
                            <Card>
                                <CardContent>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="100%" height={32} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                    <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    onClick={fetchCourses}
                    startIcon={<AnalyticsIcon />}
                >
                    Thử lại
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            {/* <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    Môn học giảng dạy
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý {courses.length} môn học mà bạn đang giảng dạy
                </Typography>
            </Box> */}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12} md={3}>
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

                {/* <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                        {stats.starred}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Yêu thích
                                    </Typography>
                                </Box>
                                <StarIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid> */}
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
                                    {getDepartments().map((dept) => (
                                        <MenuItem key={dept} value={dept}>
                                            {dept}
                                        </MenuItem>
                                    ))}
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
                                <Button
                                    variant="outlined"
                                    startIcon={<AnalyticsIcon />}
                                    size="small"
                                    onClick={fetchCourses}
                                >
                                    Làm mới
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Tabs */}
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                    variant="scrollable"
                    scrollButtons="auto"
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
                    {/* <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StarIcon />
                                Yêu thích ({stats.starred})
                            </Box>
                        } 
                    /> */}
                    {/* <Tab 
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
                    /> */}
                </Tabs>
            </Paper>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredCourses.map((course) => (
                        <Grid item xs={12} md={6} lg={4} key={course.id} sx={{ width: "32%" }}>
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
                                            {course.englishName && (
                                                <Typography variant="body2" color="text.secondary" sx={{ 
                                                    fontStyle: 'italic',
                                                    mb: 1
                                                }}>
                                                    {course.englishName}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {/* <IconButton
                                                size="small"
                                                onClick={() => handleStarToggle(course.id)}
                                                color={course.isStarred ? 'warning' : 'default'}
                                            >
                                                {course.isStarred ? <StarIcon /> : <StarBorderIcon />}
                                            </IconButton> */}
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
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
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
                                            <Tooltip title="Lớp đang hoạt động">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {course.activeClasses}
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
                                            <Tooltip title="Sĩ số tối đa">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {course.maxStudents}
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
                                    {/* <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditCourse(course)}
                                        sx={{ fontSize: '10px' }}
                                    >
                                        Chỉnh sửa
                                    </Button> */}
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
                            : 'Danh sách môn học sẽ hiển thị khi có dữ liệu từ hệ thống'
                        }
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AnalyticsIcon />}
                        onClick={fetchCourses}
                    >
                        Làm mới
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
                    {/* <MenuItem onClick={() => {
                        handleEditCourse(selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText>Chỉnh sửa</ListItemText>
                    </MenuItem> */}
                    <MenuItem onClick={() => {
                        console.log('Manage documents:', selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <MenuBookIcon />
                        </ListItemIcon>
                        <ListItemText>Quản lý tài liệu</ListItemText>
                    </MenuItem>
                    {/* <MenuItem onClick={() => {
                        console.log('Settings:', selectedCourse);
                        handleMenuClose();
                    }}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText>Cài đặt</ListItemText>
                    </MenuItem> */}
                    <Divider />
                    {/* {selectedCourse?.status === 'archived' ? (
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
                    )} */}
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
                                <Select defaultValue="Cơ sở ngành" label="Loại môn học">
                                    <MenuItem value="Cơ sở ngành">Cơ sở ngành</MenuItem>
                                    <MenuItem value="Chuyên ngành">Chuyên ngành</MenuItem>
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
                            alert('Tính năng đang phát triển!');
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
