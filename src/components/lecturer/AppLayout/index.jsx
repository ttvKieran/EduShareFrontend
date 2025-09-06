import React, { useState, useEffect } from 'react';
import API_BASE_URL from "../../../configs/system";
// import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import lecturerTheme from '../../../themes/themeLecturer';
// import { Outlet } from 'react-router-dom';
// import './style.css';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
    Badge,
    InputBase,
    Tooltip,
    ListItemButton,
    Collapse,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Dashboard,
    School,
    Assignment,
    Person,
    Settings,
    Notifications,
    AccountCircle,
    PeopleAlt,
    LibraryBooks,
    Assessment,
    Folder,
    Help,
    ExpandLess,
    ExpandMore,
    Add,
    Edit,
    Upload,
    ChevronLeft,
    ChevronRight,
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    AccessTime as AccessTimeIcon,
    Computer as SystemIcon,
    Book as BookIcon,
    Announcement,
    Grade,
    Schedule,
    Class,
    GroupWork,
    Analytics,
    CloudUpload,
    QuestionAnswer,
    Report,
    Visibility,
    Send as SendIcon,
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from '../../../contexts/AuthContext';
import { styled, alpha } from '@mui/material/styles';

// Styled components (tương tự như student layout)
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.08),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '25ch',
            '&:focus': {
                width: '35ch',
            },
        },
    },
}));

const ToggleButton = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    left: 25,
    zIndex: theme.zIndex.drawer + 2,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
        backgroundColor: '#1565c0',
        transform: 'scale(1.1)',
    },
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
}));

const MiniToggleButton = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    left: 13,
    zIndex: theme.zIndex.drawer + 2,
    backgroundColor: '#1976d2',
    color: 'white',
    size: 'small',
    '&:hover': {
        backgroundColor: '#1565c0',
        transform: 'scale(1.1)',
    },
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
}));

const drawerWidth = 270;
const miniDrawerWidth = 70;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
        marginTop: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
        },
    },
}));

const StyledMiniDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: miniDrawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
        marginTop: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        '&::-webkit-scrollbar': {
            width: '4px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#ddd',
            borderRadius: '2px',
        },
    },
}));

const LecturerAppLayout = () => {
    const [searchValue, setSearchValue] = useState('');
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [quickActionAnchorEl, setQuickActionAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { authenticatedFetch, user, logout } = useAuth();

    // State cho notification modal
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // State cho các submenu
    const [openCourses, setOpenCourses] = useState(false);
    const [openDocuments, setOpenDocuments] = useState(false);
    const [openStudents, setOpenStudents] = useState(false);
    const [openReports, setOpenReports] = useState(false);
    const [selectedItem, setSelectedItem] = useState('dashboard');

    const navigate = useNavigate();

    // Mock data cho giảng viên
    const lecturerInfo = {
        name: user?.name || "PGS. Trần Văn Minh",
        employeeId: user?.employeeCode || "GV001",
        department: "Khoa Công nghệ Thông tin",
        totalCourses: 5,
        totalStudents: 127,
        totalDocuments: 34
    };

    // Mock notifications cho lecturer
    const mockNotifications = [
        {
            _id: "1",
            title: "Yêu cầu phê duyệt tài liệu mới",
            content: "Có 3 tài liệu mới đang chờ phê duyệt từ hệ thống quản lý.",
            type: "system",
            priority: "cao",
            author: { name: "Hệ thống" },
            createdAt: "2025-08-09T14:00:00Z",
            isNew: true,
            isRead: false
        },
        {
            _id: "2",
            title: "Sinh viên nộp bài tập mới",
            content: "Có 15 bài tập mới được nộp cho môn Lập trình hướng đối tượng.",
            type: "assignment",
            priority: "trung bình",
            author: { name: "Sinh viên" },
            courseId: "6678abc123def456",
            courseName: "Lập trình hướng đối tượng",
            createdAt: "2025-08-09T10:30:00Z",
            isNew: true,
            isRead: false
        },
        {
            _id: "3",
            title: "Thông báo lịch họp khoa",
            content: "Cuộc họp tháng của khoa sẽ diễn ra vào 9h00 ngày 15/8/2025.",
            type: "schedule",
            priority: "trung bình",
            author: { name: "Phòng Khoa học" },
            createdAt: "2025-08-08T16:00:00Z",
            isNew: false,
            isRead: false
        }
    ];

    // Lecturer menu items
    const courseManagementItems = [
        { name: 'Danh sách lớp học', icon: <Class />, path: 'classes', count: lecturerInfo.totalCourses },
        { name: 'Danh sách môn học', icon: <School />, path: 'courses'},
        // { name: 'Tạo môn học mới', icon: <Add />, path: 'courses/create' },
        // { name: 'Lịch giảng dạy', icon: <Schedule />, path: 'schedule' },
        // { name: 'Phân công giảng dạy', icon: <Assignment />, path: 'assignments' }
    ];

    const documentManagementItems = [
        { name: 'Tài liệu của tôi', icon: <LibraryBooks />, path: 'documents', count: lecturerInfo.totalDocuments },
        // { name: 'Upload tài liệu', icon: <CloudUpload />, path: 'documents/upload' },
        // { name: 'Duyệt tài liệu', icon: <Visibility />, path: 'documents/review' },
        // { name: 'Thư viện chia sẻ', icon: <Folder />, path: 'documents/shared' }
    ];

    const studentManagementItems = [
        { name: 'Danh sách sinh viên', icon: <PeopleAlt />, path: 'students', count: lecturerInfo.totalStudents },
        { name: 'Quản lý điểm', icon: <Grade />, path: 'grades' },
        { name: 'Thông báo cho lớp', icon: <Announcement />, path: 'announcements' },
        { name: 'Hỗ trợ sinh viên', icon: <QuestionAnswer />, path: 'support' }
    ];

    const reportItems = [
        { name: 'Báo cáo hoạt động', icon: <Assessment />, path: 'reports/activity' },
        { name: 'Thống kê truy cập', icon: <Analytics />, path: 'reports/analytics' },
        // { name: 'Báo cáo học tập', icon: <Report />, path: 'reports/study' }
    ];

    // Event handlers
    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleClick = (item) => {
        setSelectedItem(item);
        navigate(`/lecturer/${item}`);
    };

    const handleCoursesClick = () => {
        setOpenCourses(!openCourses);
    };

    const handleDocumentsClick = () => {
        setOpenDocuments(!openDocuments);
    };

    const handleStudentsClick = () => {
        setOpenStudents(!openStudents);
    };

    const handleReportsClick = () => {
        setOpenReports(!openReports);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleQuickActionClick = (event) => {
        setQuickActionAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setNotificationAnchorEl(null);
        setProfileAnchorEl(null);
        setQuickActionAnchorEl(null);
    };

    const handleLogout = async () => {
        setProfileAnchorEl(null);
        try {
            await logout();
            toast.success("Đăng xuất thành công");
            navigate("/login");
        } catch (error) {
            toast.error("Đăng xuất thất bại");
        }
    };

    // Notification functions (tương tự student layout)
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        
        if (diffInHours < 1) return 'Vừa xong';
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        if (diffInDays < 7) return `${diffInDays} ngày trước`;
        
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'system':
                return <SystemIcon sx={{ color: '#f44336' }} />;
            case 'document':
                return <BookIcon sx={{ color: '#2196f3' }} />;
            case 'assignment':
                return <Assignment sx={{ color: '#ff9800' }} />;
            case 'schedule':
                return <Schedule sx={{ color: '#4caf50' }} />;
            default:
                return <Notifications sx={{ color: '#666' }} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'system':
                return { bgcolor: '#ffebee', color: '#f44336', borderColor: '#f44336' };
            case 'document':
                return { bgcolor: '#e3f2fd', color: '#2196f3', borderColor: '#2196f3' };
            case 'assignment':
                return { bgcolor: '#fff3e0', color: '#ff9800', borderColor: '#ff9800' };
            case 'schedule':
                return { bgcolor: '#e8f5e8', color: '#4caf50', borderColor: '#4caf50' };
            default:
                return { bgcolor: '#f5f5f5', color: '#666', borderColor: '#666' };
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'system':
                return 'Hệ thống';
            case 'document':
                return 'Tài liệu';
            case 'assignment':
                return 'Bài tập';
            case 'schedule':
                return 'Lịch trình';
            default:
                return 'Khác';
        }
    };

    const handleNotificationItemClick = (notification) => {
        setSelectedNotification(notification);
        setModalOpen(true);
        setNotificationAnchorEl(null);
        setIsFullscreen(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNotification(null);
        setIsFullscreen(false);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleViewAllNotifications = () => {
        setNotificationAnchorEl(null);
        navigate('/lecturer/notifications');
    };

    // Navigation Item Component
    const NavItem = ({ item, icon, text, onClick, badge = null, chip = null, mini = false }) => (
        <ListItem disablePadding>
            <Tooltip title={mini ? text : ""} placement="right" arrow>
                <ListItemButton
                    selected={selectedItem === item}
                    onClick={() => onClick(item)}
                    sx={{
                        borderRadius: 1,
                        mx: mini ? 0.5 : 1,
                        my: 0.5,
                        minHeight: 48,
                        justifyContent: mini ? 'center' : 'initial',
                        px: mini ? 1.5 : 2,
                        '&.Mui-selected': {
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#e3f2fd',
                            },
                        },
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                            transform: 'translateX(2px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    <ListItemIcon sx={{
                        minWidth: mini ? 0 : 40,
                        mr: mini ? 0 : 1,
                        color: selectedItem === item ? '#1976d2' : 'inherit',
                        justifyContent: 'center'
                    }}>
                        {badge ? (
                            <Badge badgeContent={badge} color="error">
                                {icon}
                            </Badge>
                        ) : (
                            icon
                        )}
                    </ListItemIcon>
                    {!mini && (
                        <ListItemText
                            primary={text}
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                    )}
                    {!mini && chip && (
                        <Chip
                            label={chip}
                            size="small"
                            color="primary"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                    )}
                </ListItemButton>
            </Tooltip>
        </ListItem>
    );

    // Notification Modal Component
    const NotificationModal = () => {
        if (!selectedNotification) return null;

        const typeStyle = getTypeColor(selectedNotification.type);

        return (
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth={false}
                fullScreen={isFullscreen}
                sx={{
                    '& .MuiDialog-paper': {
                        width: isFullscreen ? '100%' : '90%',
                        maxWidth: isFullscreen ? '100%' : '800px',
                        height: isFullscreen ? '100%' : 'auto',
                        maxHeight: isFullscreen ? '100%' : '90vh',
                        borderRadius: isFullscreen ? 0 : '12px'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    p: 3, 
                    pb: 1,
                    bgcolor: '#f8f9fa',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 2 }}>
                            {getTypeIcon(selectedNotification.type)}
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    ml: 2, 
                                    fontWeight: 600, 
                                    color: '#333',
                                    flex: 1
                                }}
                            >
                                {selectedNotification.title}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                                label={getTypeLabel(selectedNotification.type)}
                                size="small"
                                sx={{
                                    ...typeStyle,
                                    fontWeight: 600,
                                    fontSize: '0.8rem'
                                }}
                            />
                            {selectedNotification.courseName && (
                                <Chip
                                    icon={<School />}
                                    label={selectedNotification.courseName}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                        fontSize: '0.8rem',
                                        borderColor: '#2196f3',
                                        color: '#2196f3'
                                    }}
                                />
                            )}
                            {selectedNotification.isNew && (
                                <Chip
                                    label="Mới"
                                    size="small"
                                    sx={{
                                        bgcolor: '#4caf50',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            )}
                            
                            <IconButton
                                onClick={toggleFullscreen}
                                sx={{ color: '#666' }}
                                title={isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
                            >
                                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>
                            
                            <IconButton
                                onClick={handleCloseModal}
                                sx={{ color: '#666' }}
                                title="Đóng"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar 
                            sx={{ 
                                width: 40, 
                                height: 40, 
                                mr: 2, 
                                bgcolor: '#1976d2',
                                fontSize: '1.1rem',
                                fontWeight: 600
                            }}
                        >
                            {selectedNotification.author?.name?.charAt(0).toUpperCase() || 'H'}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                                {selectedNotification.author?.name || 'Hệ thống'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatTimeAgo(selectedNotification.createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 4 }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            lineHeight: 1.8,
                            color: '#333',
                            fontSize: '1.1rem',
                            whiteSpace: 'pre-line',
                            textAlign: 'justify'
                        }}
                    >
                        {selectedNotification.content}
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ 
                    p: 3, 
                    pt: 1,
                    bgcolor: '#f8f9fa',
                    borderTop: '1px solid #e0e0e0',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="caption" color="text.secondary">
                        Loại: {getTypeLabel(selectedNotification.type)}
                        {selectedNotification.courseName && ` • Môn: ${selectedNotification.courseName}`}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={toggleFullscreen}
                            startIcon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            sx={{ color: '#666' }}
                        >
                            {isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
                        </Button>
                        <Button 
                            onClick={handleCloseModal}
                            variant="contained"
                            sx={{
                                bgcolor: '#1976d2',
                                '&:hover': { bgcolor: '#1565c0' }
                            }}
                        >
                            Đóng
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <ThemeProvider theme={lecturerTheme}>
      <CssBaseline />
<Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Floating Toggle Button */}
            {drawerOpen ? (
                <ToggleButton
                    onClick={handleDrawerToggle}
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <ChevronLeft />
                </ToggleButton>
            ) : (
                <MiniToggleButton
                    onClick={handleDrawerToggle}
                    size="small"
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <ChevronRight />
                </MiniToggleButton>
            )}

            {/* Desktop Sidebar */}
            {drawerOpen ? (
                <StyledDrawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            borderRight: '0px solid #e0e0e0',
                            boxShadow: 2,
                            borderRadius: 0,
                            marginTop: 0,
                            height: '125vh',
                            overflowY: 'auto',
                        },
                    }}
                >
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            component="img"
                            sx={{
                                height: 48,
                                width: 216,
                                maxHeight: { xs: 233, md: 167 },
                                maxWidth: { xs: 350, md: 250 },
                                transition: 'all 0.3s ease-in-out',
                            }}
                            alt="Logo"
                            src="/logoBig.png"
                        />
                    </Box>
                    <Divider />
                    
                    {/* User Info */}
                    {/* <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                margin: '0 auto 8px',
                                bgcolor: '#1976d2',
                                fontSize: '1.5rem'
                            }}
                        >
                            {lecturerInfo.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {lecturerInfo.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {lecturerInfo.employeeId} • Giảng viên
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                            {lecturerInfo.department}
                        </Typography>
                    </Box> */}
                    
                    <Divider />
                    
                    <Box>
                        <List>
                            {/* Dashboard */}
                            <NavItem
                                item=""
                                icon={<Dashboard />}
                                text="Bảng điều khiển"
                                onClick={handleClick}
                                mini={false}
                            />

                            <Divider sx={{ my: 1 }} />

                            <NavItem
                                item="classes"
                                icon={<Class />}
                                text="Danh sách lớp học"
                                onClick={handleClick}
                                mini={false}
                            />

                            <NavItem
                                item="courses"
                                icon={<School />}
                                text="Danh sách môn học"
                                onClick={handleClick}
                                mini={false}
                            />

                            {/* <NavItem
                                item="schedule"
                                icon={<Schedule />}
                                text="Lịch giảng dạy"
                                onClick={handleClick}
                                mini={false}
                            /> */}

                            <NavItem
                                item="documents"
                                icon={<LibraryBooks />}
                                text="Tài liệu của tôi"
                                onClick={handleClick}
                                mini={false}
                            />

                            {/* Reports */}
                            <ListItem disablePadding>
                                <ListItemButton 
                                    onClick={handleReportsClick} 
                                    sx={{ 
                                        borderRadius: 1, 
                                        mx: 1, 
                                        my: 0.5, 
                                        transition: 'all 0.2s ease-in-out', 
                                        '&:hover': { 
                                            backgroundColor: '#f5f5f5', 
                                            transform: 'translateX(2px)' 
                                        } 
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <Assessment />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Báo cáo & Thống kê"
                                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                                    />
                                    {openReports ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>

                            <Collapse in={openReports} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {reportItems.map((item, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton
                                                selected={selectedItem === item.path}
                                                sx={{
                                                    pl: 6,
                                                    borderRadius: 1,
                                                    mx: 1,
                                                    my: 0.25,
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1976d2',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                                onClick={() => handleClick(item.path)}
                                            >
                                                <ListItemIcon sx={{
                                                    minWidth: 35,
                                                    color: selectedItem === item.path ? '#1976d2' : 'inherit'
                                                }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.name}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: selectedItem === item.path ? 600 : 400
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>

                            <Divider sx={{ my: 1 }} />

                            {/* Settings & Help */}
                            <NavItem
                                item="notifications"
                                icon={<Notifications />}
                                text="Thông báo"
                                onClick={handleClick}
                                mini={false}
                            />

                            <NavItem
                                item="profile"
                                icon={<Person />}
                                text="Thông tin cá nhân"
                                onClick={handleClick}
                                mini={false}
                            />
{/* 
                            <NavItem
                                item="settings"
                                icon={<Settings />}
                                text="Cài đặt"
                                onClick={handleClick}
                                mini={false}
                            /> */}

                            <NavItem
                                item="help"
                                icon={<Help />}
                                text="Trợ giúp"
                                onClick={handleClick}
                                mini={false}
                            />
                        </List>
                    </Box>
                </StyledDrawer>
            ) : (
                // Mini Drawer (tương tự student layout nhưng với menu lecturer)
                <StyledMiniDrawer
                    variant="permanent"
                    sx={{
                        width: miniDrawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: miniDrawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            borderRight: '0px solid #e0e0e0',
                            boxShadow: 2,
                            borderRadius: 0,
                            marginTop: 0,
                            height: '125vh',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        },
                    }}
                >
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box
                            component="img"
                            sx={{
                                height: 40,
                                width: 40,
                                marginBottom: '8px',
                                transition: 'all 0.3s ease-in-out',
                            }}
                            alt="Logo Mini"
                            src='/logo.png'
                        />
                    </Box>
                    <Divider />
                    <Box>
                        <List>
                            <NavItem
                                item=""
                                icon={<Dashboard />}
                                text="Bảng điều khiển"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="classes"
                                icon={<Class />}
                                text="Danh sách lớp học"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="courses"
                                icon={<School />}
                                text="Danh sách môn học"
                                onClick={handleClick}
                                mini={true}
                            />

                            {/* <NavItem
                                item="schedule"
                                icon={<Schedule />}
                                text="Lịch giảng dạy"
                                onClick={handleClick}
                                mini={true}
                            /> */}

                            <NavItem
                                item="documents"
                                icon={<LibraryBooks />}
                                text="Tài liệu"
                                onClick={handleClick}
                                mini={true}
                            />

                            {/* <NavItem
                                item="students"
                                icon={<PeopleAlt />}
                                text="Sinh viên"
                                onClick={handleClick}
                                mini={true}
                            /> */}

                            <NavItem
                                item="reports/activity"
                                icon={<Assessment />}
                                text="Báo cáo"
                                onClick={handleClick}
                                mini={true}
                            />

                            <Divider sx={{ my: 1 }} />

                            <NavItem
                                item="notifications"
                                icon={<Notifications />}
                                text="Thông báo"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="profile"
                                icon={<Person />}
                                text="Thông tin cá nhân"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="help"
                                icon={<Help />}
                                text="Trợ giúp"
                                onClick={handleClick}
                                mini={true}
                            />
                        </List>
                    </Box>
                </StyledMiniDrawer>
            )}

            {/* Mobile Drawer (tương tự student nhưng với menu lecturer) */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleMobileDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        backgroundColor: '#fff',
                        marginTop: '64px',
                        height: '120vh',
                    },
                }}
            >
                {/* Tương tự full drawer nhưng thêm handleMobileDrawerToggle */}
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        component="img"
                        sx={{
                            height: 48,
                            width: 216,
                            maxHeight: { xs: 233, md: 167 },
                            maxWidth: { xs: 350, md: 250 },
                        }}
                        alt="Logo"
                        src="/logoBig.png"
                    />
                </Box>
                <Divider />
                {/* User Info */}
                <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            margin: '0 auto 8px',
                            bgcolor: '#1976d2',
                            fontSize: '1.5rem'
                        }}
                    >
                        {lecturerInfo.name.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {lecturerInfo.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {lecturerInfo.employeeId} • Giảng viên
                    </Typography>
                </Box>
                {/* Mobile menu items... */}
            </Drawer>

            {/* Main Content */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                transition: 'margin-left 0.3s ease-in-out',
                width: '100%'
            }}>
                {/* Top Bar */}
                <AppBar
                    position="sticky"
                    sx={{
                        backgroundColor: 'white',
                        color: '#333',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        width: '100%',
                        left: 0
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between', background: 'white' }}>
                        {/* Mobile Menu Button */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                color="inherit"
                                onClick={handleMobileDrawerToggle}
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    color: '#666'
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                {/* Hệ thống Quản lý Giảng dạy */}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                                Giảng viên
                            </Typography>
                        </Box>

                        {/* Search và Quick Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Tìm kiếm sinh viên, môn học..."
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </Search>

                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <Tooltip title="Thao tác nhanh">
                                    <IconButton
                                        size="small"
                                        onClick={handleQuickActionClick}
                                        sx={{ color: '#666' }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Upload tài liệu">
                                    <IconButton size="small" sx={{ color: '#666' }}>
                                        <CloudUpload />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Gửi thông báo">
                                    <IconButton size="small" sx={{ color: '#666' }}>
                                        <SendIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Right side - Stats và actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <Chip
                                    icon={<School />}
                                    label={`${lecturerInfo.totalCourses} môn`}
                                    size="small"
                                    color="primary"
                                    sx={{ fontSize: '0.7rem', padding: '5px' }}
                                />
                                <Chip
                                    icon={<PeopleAlt />}
                                    label={`${lecturerInfo.totalStudents} SV`}
                                    size="small"
                                    color="success"
                                    sx={{ fontSize: '0.7rem', padding: '5px' }}
                                />
                            </Box>

                            <IconButton color="inherit" onClick={handleNotificationClick}>
                                <Badge badgeContent={mockNotifications.filter(n => !n.isRead).length} color="error">
                                    <Notifications />
                                </Badge>
                            </IconButton>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                        {lecturerInfo.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                                        {lecturerInfo.employeeId}
                                    </Typography>
                                </Box>
                                <IconButton color="inherit" onClick={handleProfileClick}>
                                    <AccountCircle />
                                </IconButton>
                            </Box>
                        </Box>
                    </Toolbar>

                    {/* Menus */}
                    {/* Notifications Menu */}
                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleClose}
                        PaperProps={{ sx: { width: 380, maxHeight: 500 } }}
                    >
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#333' }}>
                                Thông báo
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                                {mockNotifications.filter(n => !n.isRead).length} thông báo chưa đọc
                            </Typography>
                        </Box>
                        
                        {mockNotifications.slice(0, 3).map((notification, index) => (
                            <MenuItem 
                                key={notification._id}
                                onClick={() => handleNotificationItemClick(notification)}
                                sx={{ 
                                    px: 2, 
                                    py: 1.5,
                                    borderBottom: index < 2 ? '1px solid #f0f0f0' : 'none',
                                    '&:hover': { bgcolor: '#f8f9fa' }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                                    <Avatar sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        mr: 2, 
                                        ...getTypeColor(notification.type)
                                    }}>
                                        {getTypeIcon(notification.type)}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: notification.isRead ? 400 : 600, 
                                                mb: 0.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {notification.title}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#666', 
                                                fontSize: '0.75rem',
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                mb: 0.5
                                            }}
                                        >
                                            {notification.courseName || notification.content.substring(0, 50) + '...'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                                            {formatTimeAgo(notification.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                        {notification.isNew && (
                                            <Chip 
                                                label="Mới" 
                                                size="small" 
                                                color="error" 
                                                sx={{ fontSize: '0.6rem', height: 18 }} 
                                            />
                                        )}
                                        <Chip
                                            label={getTypeLabel(notification.type)}
                                            size="small"
                                            sx={{
                                                fontSize: '0.6rem',
                                                height: 18,
                                                ...getTypeColor(notification.type)
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </MenuItem>
                        ))}
                        
                        <Divider />
                        
                        <Box sx={{ p: 1 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleViewAllNotifications}
                                sx={{
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                        borderColor: '#1565c0',
                                        bgcolor: '#e3f2fd'
                                    }
                                }}
                            >
                                Xem tất cả thông báo
                            </Button>
                        </Box>
                    </Menu>

                    {/* Profile Menu */}
                    <Menu
                        anchorEl={profileAnchorEl}
                        open={Boolean(profileAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/profile'); }}>
                            Thông tin cá nhân
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/settings'); }}>
                            Cài đặt tài khoản
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/reports/activity'); }}>
                            Báo cáo hoạt động
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                    </Menu>

                    {/* Quick Actions Menu */}
                    <Menu
                        anchorEl={quickActionAnchorEl}
                        open={Boolean(quickActionAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/courses/create'); }}>
                            <Add sx={{ mr: 2 }} />
                            Tạo môn học mới
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/documents/upload'); }}>
                            <CloudUpload sx={{ mr: 2 }} />
                            Upload tài liệu
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/announcements'); }}>
                            <Announcement sx={{ mr: 2 }} />
                            Gửi thông báo
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/students'); }}>
                            <PeopleAlt sx={{ mr: 2 }} />
                            Quản lý sinh viên
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/lecturer/grades'); }}>
                            <Grade sx={{ mr: 2 }} />
                            Nhập điểm
                        </MenuItem>
                    </Menu>
                </AppBar>

                {/* Content Area */}
                <Box sx={{ backgroundColor: 'background.default' }}>
                    <Outlet />
                </Box>
                
                {/* Notification Modal */}
                <NotificationModal />
            </Box>
        </Box>
    </ThemeProvider>
        
    );
};

export default LecturerAppLayout;